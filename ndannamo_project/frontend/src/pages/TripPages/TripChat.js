import React, { useEffect, useState, useRef } from "react";
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import Message from './Chat/Message.js'
import InternalMenu from "./InternalMenu";
import './InternalMenu.css';
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { BsSend } from "react-icons/bs";
import "./Chat/Chat.css"

import ChatService from "../../services/ChatService.js";
import TripService from "../../services/TripService";
import UserService from "../../services/UserService";

import { useWebSocket } from "../../utils/WebSocketProvider.js";

export default function TripChat() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [tripInfo, setTripInfo] = useState(location.state?.trip);
    const [profileInfo, setProfileInfo] = useState(location.state?.profile);
    //const tripInfo = location.state?.trip; // Recupera il tripInfo dallo stato
    //const userId = location.state?.profile.id;
    //const userNickname = location.state?.profile.nickname;
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    //const [stompClient, setStompClient] = useState(null);
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const messagesEndRef = useRef(null);
    const [chatParticipants, setChatParticipants] = useState([]);
    const [fetched, setFetched] = useState(false);
    const [subscribed, setSubscribed] = useState({});
    const { connected, getClient } = useWebSocket();
    const subscriptionsRef = useRef({}); // Oggetto di riferimento per le sottoscrizioni attive

    const fetchTripInfo = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate("/login");
            }
            const response = await TripService.getTrip(token, id);
            if (response) {
                setTripInfo(response);
                
            } else {
                console.error('Invalid response data');
            }
        } catch (error) {
            console.error('Error fetching trip info:', error);
        }
    }
    if (!tripInfo) {
        fetchTripInfo();
    }
    const fetchProfileInfo = async () => {
        try {
            const token = localStorage.getItem('token'); // Recuperiamo il token da localStorage
            if (!token) {
                navigate("/login");
            }

            // Chiamata al servizio per ottenere le informazioni del profilo
            const response = await UserService.getProfile(token);

            if (response) {
                setProfileInfo(response);  // Aggiorniamo lo stato con le informazioni del profilo
            } else {
                console.error('Invalid response data');
            }
        } catch (error) {
            console.error('Error fetching profile information:', error);
        }
    };
    if (!profileInfo) {
        fetchProfileInfo();
    }

    // Funzione per sottoscrivere un canale
    const subscribeToChannel = (channel, response) => {
        const client = getClient();
        if (client && connected && !subscribed.hasOwnProperty(channel)) {
            const subscription = client.subscribe(`/topic/${channel}`, response);

            // Aggiungi la sottoscrizione alla lista
            setSubscribed((prevSubscribed) => ({
                ...prevSubscribed,
                [channel]: subscription,
            }));

            // Salva la sottoscrizione nel riferimento per poterla annullare successivamente
            subscriptionsRef.current[channel] = subscription;
        }
    };

    // Funzione per annullare la sottoscrizione da un canale
    const unsubscribeFromChannel = (channel) => {
        if (subscriptionsRef.current[channel]) {
            subscriptionsRef.current[channel].unsubscribe();
            delete subscriptionsRef.current[channel]; // Rimuovi la sottoscrizione dal riferimento
            setSubscribed((prevSubscribed) => {
                const newSubscribed = { ...prevSubscribed };
                delete newSubscribed[channel]; // Rimuovi la sottoscrizione dallo stato
                return newSubscribed;
            });
        }
    };

    const encodeEmail = (email) => {
        return email.replace(/@/g, "at").replace(/\./g, "dot");
    };

    useEffect(() => {
        // Esempio di sottoscrizione automatica a più canali
        const channels = [
            [`messages/${tripInfo?.id}`, (msg) => {
                setMessages((prev) => [...prev, JSON.parse(msg.body)]);
            }],
        ];

        channels.forEach((channel) => subscribeToChannel(channel[0], channel[1]));

        const participants = tripInfo.list_participants || [];

        participants.forEach((participant) => {
            const encoded = encodeEmail(participant.email);
            subscribeToChannel(`notice/${encoded}/status`, (message) => {
                const data = JSON.parse(message.body); // dipende da come arriva il messaggio
                const { userEmail, online } = data;
        
                // Trova il participant corrispondente
                const participantToUpdate = participants.find(p => p.email === userEmail);
        
                if (participantToUpdate) {
                    // Aggiorna la proprietà "online" del partecipante
                    participantToUpdate.online = online;
            
                    // Triggera l'aggiornamento dello stato
                    setChatParticipants((prevParticipants) =>
                        prevParticipants.map((p) =>
                            p.email === userEmail ? { ...p, online: online } : p
                        )
                    );
                }
            });
        });

        // Funzione di cleanup per annullare tutte le sottoscrizioni quando il componente è smontato
        return () => {
            Object.keys(subscriptionsRef.current).forEach((channel) => {
                unsubscribeFromChannel(channel);
            });
        };
    }, [connected]);

    const initParticipants = async (token) => {

        const participants = tripInfo.list_participants || [];

        try {
            const onlineUsers = await ChatService.getOnlineUsers(token, tripInfo?.id);
            const new_list_participants = participants.map((u) => ({
                id: u.id,
                nickname: u.nickname,
                email: u.email,
                online: onlineUsers.includes(u.email), // se l'user è nella lista online, metti true
            }));

            setChatParticipants(new_list_participants);
        } catch (error) {
            console.error("Errore recupero utenti online:", error);
        }
    };

    useEffect(() => {
        if (!tripInfo) return;
    
        const token = localStorage.getItem('token');
    
        initParticipants(token);
    
        const fetchMessages = async () => {
            try {
                const response = await ChatService.getMessages(token, tripInfo?.id);
                const sortedMessages = response.sort((a, b) => new Date(a.date) - new Date(b.date));
                setMessages(sortedMessages);
            } catch (error) {
                console.log(error);
            }
        };
    
        if (!fetched) {
            fetchMessages();
            setFetched(true);
        }
        
    }, [tripInfo]);
    
    useEffect(() => {
        console.log('chatParticipants aggiornati:', chatParticipants);
    }, [chatParticipants]);


    const sendMessage = () => {
        const client = getClient();
        if (client && connected) {
            const messageObj = {
                senderId: profileInfo.id,
                nickname: profileInfo.nickname,
                body: message,
                date: new Date().toISOString(), // Data e ora del messaggio
            };

            client.publish({
                destination: `/app/chat/${tripInfo?.id}`, // Canale di destinazione
                body: JSON.stringify(messageObj),
            });
        } else {
            console.error('WebSocket non connesso!');
        }
    };


    function handleInput(newValue) {
        setMessage(newValue)
        if (newValue == "")
            setButtonDisabled(true);
        else
            setButtonDisabled(false);
    }


    function handleClick() {
        sendMessage();
        setMessage("");
        setButtonDisabled(true);

        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    }


    function formatDateLabel(date) {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
    
        if (isSameDay(date, today)) {
            return "Oggi";
        } else if (isSameDay(date, yesterday)) {
            return "Ieri";
        } else {
            return date.toLocaleDateString('it-IT', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
    }

    
    function isSameDay(date1, date2) {
        return date1.getFullYear() === date2.getFullYear() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getDate() === date2.getDate();
    }    


    if (!tripInfo) {
        return <p>Loading trip details...</p>;
    }

    return (
        <div>
            {tripInfo && profileInfo &&
                <div className="trip-info">
                    <InternalMenu tripInfo={tripInfo}/>
                    <div className="trip-content">
                        <div className="trip-top">
                            <span> <strong>{tripInfo.title}</strong> {tripInfo.startDate} {tripInfo.endDate}</span>
                        </div>
                        <div className="ch-main-container">
                            <div className="ch-col ch-col-1">
                                <div className="participants-container">
                                    <h3>Participants</h3>
                                    {chatParticipants.length > 0 ? (
                                        <ul className="participants-list">
                                            {chatParticipants.map((participant) => (
                                                <li key={participant.id} className="participant-item">
                                                    <span className="participant-nickname">{participant.nickname}</span>
                                                    <span className={`participant-status ${participant.online ? 'online' : 'offline'}`}>
                                                        ● {participant.online ? 'Online' : 'Offline'}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p>Nessun partecipante</p>
                                    )}
                                </div>
                            </div>
                            <div className="chat-container">
                            <div className="chat-messages">
                                {(() => {
                                    let lastDate = null; // QUI! Prima del ciclo

                                    return messages.map((msg, index) => {
                                        const messageDate = new Date(msg.date);
                                        const formattedDate = messageDate.toLocaleDateString('it-IT', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        });

                                        let showDateSeparator = false;
                                        if (formattedDate !== lastDate) {
                                            showDateSeparator = true;
                                            lastDate = formattedDate;
                                        }

                                        return (
                                            <React.Fragment key={index}>
                                                {showDateSeparator && (
                                                    <div className="date-separator">
                                                        <span>{formatDateLabel(messageDate)}</span>
                                                    </div>
                                                )}
                                                <Message
                                                    date={msg.date}
                                                    nickname={msg.nickname}
                                                    body={msg.body}
                                                    senderId={msg.senderId}
                                                    receiverId={profileInfo.id}
                                                />
                                            </React.Fragment>
                                        );
                                    });
                                })()}
                                    <div ref={messagesEndRef} />
                                </div>
                                <div className="chat-input">
                                    <textarea
                                        className="chat-input-input"
                                        value={message}
                                        onChange={(e) => handleInput(e.target.value)}
                                        placeholder="Scrivi un messaggio...">
                                    </textarea>
                                    <button
                                        className="chat-input-button"
                                        id="sendButton"
                                        disabled={buttonDisabled}
                                        onClick={() => handleClick()}
                                    >
                                        <BsSend />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
    </div>
    );
}
