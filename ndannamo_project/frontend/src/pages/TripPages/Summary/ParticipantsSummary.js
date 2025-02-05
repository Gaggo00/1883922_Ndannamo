import "./TripSummary.css";
import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import UndoConfirm from "../../../common/UndoConfirm";
import edit_icon from "../../../static/svg/icons/edit_icon.svg";
import TripService from "../../../services/TripService";
import { useLocation } from 'react-router-dom';
import participants_icon from "../../../static/svg/icons/partecipants_icon.svg";
import participant_icon from "../../../static/svg/icons/partecipant_icon.svg";

export default function ParticipantsSummary() {
    const [changeParticipants, setChangeParticipants] = useState(false);
    const [newParticipant, setNewParticipant] = useState("");

    const [invitations, setInvitations] = useState([]);
    const [participants, setParticipants] = useState([]);

    const navigate = useNavigate();
    const location = useLocation();
    const tripInfo = location.state?.trip; // Recupera il tripInfo dallo stato
    const profileInfo = location.state?.profile; // Recupera il tripInfo dallo stato


    const handleEditParticipants = () => {
        setChangeParticipants(true);
        setParticipants(tripInfo.list_participants);
        setInvitations(tripInfo.list_invitations);
    }

    const handleChangeParticipants = async () => {
        if (participants === tripInfo.list_invitations || invitations === tripInfo.list_invitations) {
            setChangeParticipants(false);
        } else {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate("/login");
                }

                const response = await TripService.updateParticipants(token, tripInfo.id, participants,invitations);

                if (response) {
                    setChangeParticipants(false)
                    navigate(`/trips/${tripInfo.id}/summary`, { state: { trip: tripInfo, profile: profileInfo } })
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

    const handleAddParticipant = () => {
        if (newParticipant && !invitations.includes(newParticipant)) { // Aggiungi solo se non è già presente
            setInvitations([...invitations, newParticipant]); // Aggiorna la lista dei partecipanti
            setNewParticipant(""); // Resetta il campo di input
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
                    <img src={participants_icon} alt="participants_icon" />
                    <p>Participants</p>
                </div>
                {!changeParticipants &&
                    <img id="edit" className="editable" onClick={handleEditParticipants} src={edit_icon} alt="edit_icon" />}
                {changeParticipants && <UndoConfirm
                    onConfirm={handleChangeParticipants}
                    onUndo={undoChangeParticipants} />}
            </div>
            <div className="partecipants-section">
                <div className="partecipants">
                    {/*if you don't want to change the participants */}
                    {!changeParticipants && tripInfo.list_participants.map((participant, index) => (
                        <div className="partecipant" key={index}>
                            <i id="participant-icon" className="bi bi-person-fill h2"></i>
                            {participant !== profileInfo.nickname ? <p>{participant}</p> : <p>you</p>}
                        </div>))}
                    {!changeParticipants && tripInfo.list_invitations.map((participant, index) => (
                            <div className="partecipant" key={index}>
                                <i id="invitation-icon" className="bi bi-person-fill-add h2"></i>
                                {participant !== profileInfo.nickname
                                    ? <p>{participant.length > 6 ? participant.substring(0, 10) + "..." : participant}</p>
                                    : <p>you</p>}
                            </div>))
                    }
                    {/* if you want to change the participants */}
                    {changeParticipants && participants.map((participant, index) => (
                        <div className="partecipant" key={index}>
                            {participant !== profileInfo.nickname &&
                                <div id="delete" onClick={() => removeParticipant(index)}><i
                                    className="bi bi-trash3 h6"></i></div>}
                            <i id="participant-icon" className="bi bi-person-fill h2"></i>
                            {participant !== profileInfo.nickname ? <p>{participant}</p> : <p>you</p>}
                        </div>
                    ))}
                    {/* if you want to change the participants */}
                    {changeParticipants && invitations.map((participant, index) => (
                        <div className="partecipant" key={index}>
                            <div id="delete" onClick={() => removeInvitation(index)}><i
                                className="bi bi-trash3 h6"></i></div>
                            <i id="invitation-icon" className="bi bi-person-fill-add h2"></i>
                            {participant !== profileInfo.nickname
                                ? <p>{participant.length > 6 ? participant.substring(0, 10) + "..." : participant}</p>
                                : <p>you</p>}
                        </div>
                    ))}
                </div>
                {changeParticipants && (
                    <div className="add-part">
                        <label>
                            <input
                                type="text"
                                name="email"
                                value={newParticipant}
                                onChange={handleChange}
                                placeholder='Enter the email'
                            />
                        </label>
                        <button onClick={handleAddParticipant}>+</button>
                    </div>
                )}
            </div>
        </div>
    );
}
