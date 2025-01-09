import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TripService from "../../services/TripService";
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

export default function TripSummary() {
    const { id } = useParams();
    const [tripInfo, setTripInfo] = useState({
        id: '',
        title: '',
        locations: [],
        creationDate: '',
        startDate: '',
        endDate: '',
        createdBy: '',
        list_participants: []
    });
    const navigate = useNavigate();

    useEffect(() => {
        fetchTripInfo();
    }, []);

    const fetchTripInfo = async () => {
        try {
            const token = localStorage.getItem('token'); // Recuperiamo il token da localStorage
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
            console.error('Error fetching profile information:', error);
        }
    };

    return (
        <div className="trip-info">
            <InternalMenu />
            <div className="trip-content">
                <div className="trip-top">
                    <span>
                        <strong>{tripInfo.title}</strong> {tripInfo.startDate} {tripInfo.endDate}
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
                                        <img src={partecipant_icon} alt="partecipant_icon"/>
                                        <p>{participant}</p>
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
                                <img id="edit" src={edit_icon} alt="edit_icon"/>
                            </div>
                            <div className="internal-section">
                                <img src={calendar} alt="globe"/>
                                <div className="dates">
                                    <p className="date">{tripInfo.startDate}</p>
                                    <img src={arrow_down} alt="arrow_down"/>
                                    <p className="date">{tripInfo.endDate}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
