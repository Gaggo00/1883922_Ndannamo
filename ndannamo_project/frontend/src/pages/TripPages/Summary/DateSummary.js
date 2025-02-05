import "./TripSummary.css";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UndoConfirm from "../../../common/UndoConfirm";
import calendar_icon from "../../../static/svg/icons/calendar_icon.svg";
import calendar from "../../../static/calendar.png";
import arrow_down from "../../../static/svg/icons/arrow-down2.svg";
import DateUtilities from "../../../utils/DateUtilities";
import edit_icon from "../../../static/svg/icons/edit_icon.svg";
import TripService from "../../../services/TripService";
import { useLocation } from 'react-router-dom';


export default function DateSummary() {

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
        <div className="mini-section" id="mini2">
            <div className="header-section" id="section3">
                <div className="icon-label">
                    <img src={calendar_icon} alt="calendar_icon" />
                    <p>Dates</p>
                </div>
                {!changeDate &&
                    <img id="edit" class="editable" onClick={handleEditDates} src={edit_icon} alt="edit_icon" />}
                {changeDate && <UndoConfirm
                    onConfirm={handleChangeDates}
                    onUndo={undoChangeDates} />}
            </div>
            <div className="internal-section">
                <img src={calendar} alt="globe" />
                <div className="dates">
                    {!changeDate && <p className="date">{DateUtilities.yyyymmdd_To_ddMONTHyyyy(tripInfo.startDate)}</p>}
                    {changeDate && <input
                        className="date"
                        type="date"
                        name="startDate"
                        onChange={handleStartDateChange}
                        value={newStartDate}
                    ></input>}
                    <img src={arrow_down} alt="arrow_down" />
                    {!changeDate && <p className="date">{DateUtilities.yyyymmdd_To_ddMONTHyyyy(tripInfo.endDate)}</p>}
                    {changeDate && <input
                        className="date"
                        type="date"
                        name="endDate"
                        value={newEndDate}
                        onChange={handleEndDateChange}
                    ></input>}
                </div>
            </div>
        </div>
    );
}

