import "./TripSummary.css";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UndoConfirm from "../../../common/UndoConfirm";
import edit_icon from "../../../static/svg/icons/edit_icon.svg";
import TripService from "../../../services/TripService";
import { useLocation } from 'react-router-dom';
import participants_icon from "../../../static/svg/icons/partecipants_icon.svg";
import participant_icon from "../../../static/svg/icons/partecipant_icon.svg";


export default function ParticipantsSummary() {

    const [changeDate, setChangeDate] = useState(false);
    const [newEndDate, setNewEndDate] = useState(null);
    const [newStartDate, setNewStartDate] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const tripInfo = location.state?.trip; // Recupera il tripInfo dallo stato
    const profileInfo = location.state?.profile; // Recupera il tripInfo dallo stato

    const handleEditDates = () => {
        setNewStartDate(tripInfo.startDate);
        setNewEndDate(tripInfo.endDate);
        setChangeDate(true);
    }

    const handleChangeDates = async () => {
        if (newEndDate === tripInfo.endDate && newStartDate === tripInfo.startDate) {
            setChangeDate(false);
        } else {
            if (newEndDate > newStartDate) {
                try {
                    const token = localStorage.getItem('token');
                    if (!token) {
                        navigate("/login");
                    }
                    const response = await TripService.updateDates(token, tripInfo.id, newStartDate, newEndDate);

                    if (response) {
                        setChangeDate(false)
                        tripInfo.startDate = newStartDate;
                        tripInfo.endDate = newEndDate;
                        navigate(`/trips/${tripInfo.id}/summary`, { state: { trip: tripInfo, profile: profileInfo } })
                        console.log("dates changed!")
                    } else {
                        console.error('Invalid response data');
                    }
                } catch (error) {
                    console.error('Error fetching schedule:', error);
                }
            }
        }

    }
    const handleStartDateChange = (e) => {
        setNewStartDate(e.target.value); // Aggiorna lo stato quando l'utente modifica la data
    };
    const handleEndDateChange = (e) => {
        setNewEndDate(e.target.value); // Aggiorna lo stato quando l'utente modifica la data
    };
    function undoChangeDates() {
        setChangeDate(false);
    }

    return (
        <div className="sezione1">
            <div className="header-section" id="section1">
                <div className="icon-label">
                    <img src={participants_icon} alt="participants_icon" />
                    <p>Participants</p>
                </div>
                <img id="edit" src={edit_icon} alt="edit_icon" />
            </div>
            <div className="partecipants-section">
                <div className="partecipants">
                    {tripInfo.list_participants.map((participant, index) => (
                        <div className="partecipant" key={index}>
                            {<img src={participant_icon} alt="participant_icon" />}
                            {participant !== profileInfo.nickname && <p>{participant}</p>}
                            {participant === profileInfo.nickname && <p>you</p>}
                        </div>
                    ))}
                </div>
                <button>+</button>
            </div>
        </div>
    );
}

