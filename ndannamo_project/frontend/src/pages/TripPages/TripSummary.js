import React, {useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import InternalMenu from "./InternalMenu";
import "./TripSummary.css";
import edit_icon from "../../static/svg/icons/edit_icon.svg";
import partecipants_icon from "../../static/svg/icons/partecipants_icon.svg";
import partecipant_icon from "../../static/svg/icons/partecipant_icon.svg";
import navigator_icon from "../../static/svg/icons/navigator_arrow_icon.svg";
import calendar_icon from "../../static/svg/icons/calendar_icon.svg";
import calendar from "../../static/calendar.png";
import globe from "../../static/globe.png";
import arrow_down from "../../static/svg/icons/arrow-down2.svg";
import DateUtilities from "../../utils/DateUtilities";
import TripService from "../../services/TripService";

export default function TripSummary() {
    const location = useLocation();
    const tripInfo = location.state?.trip; // Recupera il tripInfo dallo stato
    const profileInfo = location.state?.profile; // Recupera il tripInfo dallo stato
    const [changeDate, setChangeDate] = useState(false);
    const [newEndDate, setNewEndDate] = useState(tripInfo.endDate);
    const [newStartDate, setNewStartDate] = useState(tripInfo.startDate);
    const navigate = useNavigate();

    const handleEditDates = () =>{
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
                        tripInfo.startDate=newStartDate;
                        tripInfo.endDate = newEndDate;
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

    return (
        <div className="trip-info">
            <InternalMenu />
            <div className="trip-content">
                <div className="trip-top">
                    <span>
                        <strong>{tripInfo.title}</strong> {DateUtilities.yyyymmdd_To_ddmm(tripInfo.startDate,"-","/")} - {DateUtilities.yyyymmdd_To_ddmm(tripInfo.endDate,"-","/")}
                    </span>
                </div>
                <div className="trip-details">
                    <div className="sezione1">
                        <div className="header-section" id="section1">
                            <div className="icon-label">
                                <img src={partecipants_icon} alt="partecipant_icon"/>
                                <p>Participants</p>
                            </div>
                            <img id="edit" src={edit_icon} alt="edit_icon"/>
                        </div>
                        <div className="partecipants-section">
                            <div className="partecipants">
                                {tripInfo.list_participants.map((participant, index) => (
                                    <div className="partecipant" key={index}>
                                        {<img src={partecipant_icon} alt="partecipant_icon"/>}
                                        {participant !== profileInfo.nickname && <p>{participant}</p>}
                                        {participant === profileInfo.nickname && <p>you</p>}
                                    </div>
                                ))}
                            </div>
                            <button>+</button>
                        </div>
                    </div>
                    <div className="other-section">
                        <div className="mini-section" id="mini1">
                            <div className="header-section" id="section2">
                                <div className="icon-label">
                                    <img src={navigator_icon} alt="navigator_icon"/>
                                    <p>Destinations</p>
                                </div>
                                <img id="edit" src={edit_icon} alt="edit_icon"/>
                            </div>
                            <div className="internal-section">
                                <img src={globe} alt="globe"/>
                                <div className="list-destination">
                                    {tripInfo.locations.map((location, index) => (
                                            <p>{location}</p>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="mini-section" id="mini2">
                            <div className="header-section" id="section3">
                                <div className="icon-label">
                                    <img src={calendar_icon} alt="calendar_icon"/>
                                    <p>Destinations</p>
                                </div>
                                {!changeDate && <img id="edit" class="editable" onClick={handleEditDates} src={edit_icon} alt="edit_icon"/>}
                                {changeDate && <i class="editable" onClick={handleChangeDates} className="bi bi-floppy-fill"></i>}
                            </div>
                            <div className="internal-section">
                                <img src={calendar} alt="globe"/>
                                <div className="dates">
                                    {!changeDate && <p className="date">{DateUtilities.yyyymmdd_To_ddMONTHyyyy(tripInfo.startDate)}</p>}
                                    {changeDate && <input
                                        className="date"
                                        type="date"
                                        name="startDate"
                                        onChange={handleStartDateChange}
                                        value={newStartDate}
                                    ></input>}
                                    <img src={arrow_down} alt="arrow_down"/>
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
                    </div>
                </div>
            </div>
        </div>
    );
}
