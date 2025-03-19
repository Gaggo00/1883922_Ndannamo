import "./TripSummary.css";
import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import UndoConfirm from "../../../common/UndoConfirm";
import edit_icon from "../../../static/svg/icons/edit_icon.svg";
import TripService from "../../../services/TripService";
import { useLocation } from 'react-router-dom';
import participants_icon from "../../../static/svg/icons/partecipants_icon.svg";
import UsersService from "../../../services/UsersService";

export default function ParticipantsSummary() {
    const [changeParticipants, setChangeParticipants] = useState(false);
    const [newParticipant, setNewParticipant] = useState("");

    const [invitations, setInvitations] = useState([]);
    const [participants, setParticipants] = useState([]);

    const navigate = useNavigate();
    const location = useLocation();
    const tripInfo = location.state?.trip; // Recupera il tripInfo dallo stato
    const profileInfo = location.state?.profile; // Recupera il tripInfo dallo stato
    const [listUsers, setListUsers] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");


    useEffect(() => {
        initUserList();
    }, []);


    const handleEditParticipants = () => {
        setChangeParticipants(true);
        setParticipants(tripInfo.list_participants);
        setInvitations(tripInfo.list_invitations);
        console.log("list_invitations", tripInfo.list_invitations);
        setErrorMessage([]);
    }

    const handleChangeParticipants = async () => {
        let email_participants = participants.map(p => p.email);
        let email_list_participants = tripInfo.list_participants.map(p => p.email);
        let email_list_invitations = tripInfo.list_invitations.map(p => p.email);
        let email_invitations = invitations.map(p =>
            (typeof p === "object" && p !== null && "email" in p) ? p.email : p
        );

        if (email_participants === email_list_participants && email_invitations === email_list_invitations) {
            setChangeParticipants(false);
        } else {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate("/login");
                }
                //console.log("1:", email_participants);
                //console.log("2:", email_invitations);
                //console.log("3:", email_list_participants);
                //console.log("4:", email_list_invitations);
                const response = await TripService.updateParticipants(token, tripInfo.id, email_participants, email_invitations, email_list_participants, email_list_invitations);

                if (response) {
                    setChangeParticipants(false);

                    let data = await TripService.getTrip(token, tripInfo.id);
                    navigate(`/trips/${tripInfo.id}/summary`, {state: {trip: data, profile: profileInfo}})
                    console.log("Participants updated!");
                } else {
                    console.error('Invalid response data');
                }
            } catch (error) {
                console.error('Error updating participants:', error);
            }
        }
    }

    function undoChangeParticipants() {
        setChangeParticipants(false);
    }

    const handleChange = (event) => {
        setNewParticipant(event.target.value); // Aggiorna lo stato dell'input
    }

    const initUserList = async ()=> {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate("/login");
            }
            let response = await UsersService.getAllUsers(token);
            if (response) {
                //listUsersBackup = [...(response.map(p => p.email))];
                setListUsers(response.map(p => p.email));
            }

        } catch (error) {
            console.error('Error updating participants:', error);
        }

    }

    const handleAddParticipant = () => {

        //console.log("list:");
        //console.log(listUsers);

        const newParticipantTrim = newParticipant.trim();

        if (newParticipantTrim === "") {
            return;
        }

        if (listUsers.length === 0) {
            initUserList();
        }
        if (listUsers.includes(newParticipantTrim) && !invitations.includes(newParticipantTrim)) { // Aggiungi solo se non è già presente
            setInvitations([...invitations, newParticipantTrim]); // Aggiorna la lista dei partecipanti
            setNewParticipant(""); // Resetta il campo di input
        }
        else {
            console.log("email not found!");
            setErrorMessage("email not found!");
        }
    }

    function removeInvitation(index) {
        setInvitations(invitations.filter((_, i) => i !== index));

    }

    function removeParticipant(index) {
        setParticipants(participants.filter((_, i) => i !== index));
    }

    return (
        <div className="sezione1">
            <div className="header-section" id="section1">
                <div className="icon-label">
                    <img src={participants_icon} alt="participants_icon"/>
                    <p>Participants</p>
                </div>
                {!changeParticipants && tripInfo.creator &&
                    <img id="edit" className="editable" onClick={handleEditParticipants} src={edit_icon}
                         alt="edit_icon"/>}
                {changeParticipants && <UndoConfirm
                    onConfirm={handleChangeParticipants}
                    onUndo={undoChangeParticipants}/>}
            </div>
            <div className="partecipants-section">
                <div className="partecipants">
                    {/*if you don't want to change the participants */}
                    {!changeParticipants && tripInfo.list_participants.map((participant, index) => (
                        <div className="partecipant" key={index}>
                            <i id="participant-icon" className="bi bi-person-fill h2"></i>
                            {participant.nickname !== profileInfo.nickname ? <p>{participant.nickname}</p> : <p>you</p>}
                        </div>))}
                    {!changeParticipants && tripInfo.list_invitations.map((participant, index) => (
                        <div className="partecipant" key={index}>
                            <i id="invitation-icon" className="bi bi-person-fill-add h2"></i>
                            {participant.nickname !== profileInfo.nickname
                                ?
                                <p>{participant.length > 6 ? participant.substring(0, 10) + "..." : participant.nickname}</p>
                                : <p>you</p>}
                        </div>))
                    }
                    {/* if you want to change the participants */}
                    {changeParticipants && participants.map((participant, index) => (
                        <div className="partecipant" key={index}>
                            {participant.nickname !== profileInfo.nickname &&
                                <div id="delete" onClick={() => removeParticipant(index)}><i
                                    className="bi bi-trash3 h6"></i></div>}
                            <i id="participant-icon" className="bi bi-person-fill h2"></i>
                            {participant.nickname !== profileInfo.nickname ? <p>{participant.nickname}</p> : <p>you</p>}
                        </div>
                    ))}
                    {/* if you want to change the participants */}
                    {changeParticipants && invitations.map((participant, index) => (
                        <div className="partecipant" key={index}>
                            <div id="delete" onClick={() => removeInvitation(index)}><i
                                className="bi bi-trash3 h6"></i></div>
                            <i id="invitation-icon" className="bi bi-person-fill-add h2"></i>
                            {participant.nickname !== profileInfo.nickname
                                ?
                                <p>{participant.length > 6 ? participant.substring(0, 10) + "..." : participant.nickname}</p>
                                : <p>you</p>}
                        </div>
                    ))}
                </div>
                {changeParticipants && (
                    <div className="add-part">
                        <div className="input-container">
                            <div className="input-wrapper">
                                <input
                                    type="text"
                                    name="email"
                                    value={newParticipant}
                                    onChange={handleChange}
                                    placeholder="Enter the email"
                                />
                                <button onClick={handleAddParticipant}>+</button>
                            </div>
                            <p id="error-message" className={errorMessage ? "visible" : ""}>
                                {errorMessage}
                            </p>
                        </div>
                  </div>
                )}
            </div>
        </div>
    );
}
