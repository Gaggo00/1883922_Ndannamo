import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from "@stomp/stompjs";

const WebSocketContext = createContext(null);

export const useWebSocket = () => {
  return useContext(WebSocketContext);
};

export const WebSocketProvider = ({ children }) => {
    const stompClientRef = useRef(null);
    const heartbeatIntervalRef = useRef(null);
    const [connected, setConnected] = useState(false);

    const connect = (passedToken) => {
        const token = passedToken || localStorage.getItem('token');
        if (!token) return;

        const socket = new SockJS(`http://localhost:8082/ws?token=${token}`);
        
        console.log("➡️ Tentativo di connessione WebSocket...");

        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000, // Riconnessione automatica se vuoi
            onConnect: () => {
                console.log('✅ WebSocket connesso!');
                setConnected(true);

                // Esempio di heartbeat, da gestire se serve
                heartbeatIntervalRef.current = setInterval(() => {
                    client.publish({
                        destination: '/app/presence/heartbeat',
                        body: JSON.stringify({ message: 'ping' })
                    });
                }, 5000);
            },
            onDisconnect: () => {
                console.log('❌ WebSocket disconnesso!');
                setConnected(false);
            },
            onStompError: (frame) => {
                console.error('❗ Errore STOMP:', frame.headers.message);
            }
        });

        client.activate();
        stompClientRef.current = client;
    };

    const disconnect = () => {
        if (stompClientRef.current) {
            console.log('⛔ Disconnessione manuale del WebSocket...');
            stompClientRef.current.deactivate();
            stompClientRef.current = null;
            setConnected(false);
        }

        if (heartbeatIntervalRef.current) {
            clearInterval(heartbeatIntervalRef.current);
            heartbeatIntervalRef.current = null;
        }

        setConnected(false);
    };

    useEffect(() => {
        connect();

        return () => {
            disconnect(); // Cleanup on unmount
        };
    }, []);

    return (
        <WebSocketContext.Provider value={{
            connect,
            disconnect,
            connected,
            getClient: () => stompClientRef.current // Se serve accedere al client da fuori
        }}>
            {children}
        </WebSocketContext.Provider>
    );
};
