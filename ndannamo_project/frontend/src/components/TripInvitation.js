import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import UserService from '../services/UserService';

import logo from '../static/Logo app.png'
import "../styles/TripPreview.css";


export default function TripInvitation({trip, reloadProfile}) {

    const navigate = useNavigate();

    const startDateArray = trip.startDate.split("-");
    const startDate = startDateArray[2] + "/" + startDateArray[1] + "/" + startDateArray[0].substring(2)
    const endDateArray = trip.endDate.split("-");
    const endDate = endDateArray[2] + "/" + endDateArray[1] + "/" + endDateArray[0].substring(2)

    var locationString = trip.locations[0];
    if (trip.locations.length > 1) {
        locationString += ", ...";
    }

    var participantsStr = trip.list_participants[0];
    if (trip.list_participants.length > 1) {
        participantsStr += ", " + trip.list_participants[1];
    }
    if (trip.list_participants.length > 2) {
        const quantity = trip.list_participants.length - 2;
        participantsStr += " and " + quantity + " more";
    }


    const acceptInvitation = async () => {
        try {
            const token = localStorage.getItem('token'); // Recuperiamo il token da localStorage
            if (!token) {
                navigate("/login");
            }
            // Chiamata al servizio per accettare
            const response = await UserService.acceptInvitation(token, trip.id, true);

            if (response) {
                //setProfileInfo(response);  // Aggiorniamo lo stato con le informazioni del profilo
                reloadProfile();
                console.log("Invitation accepted!")
            } else {
                console.error('Invalid response data');
            }
        } catch (error) {
            console.error('Error fetching profile information:', error);
        }
    };

    const refuseInvitation = async () => {
        try {
            const token = localStorage.getItem('token'); // Recuperiamo il token da localStorage
            if (!token) {
                navigate("/login");
            }
            // Chiamata al servizio per accettare
            const response = await UserService.acceptInvitation(token, trip.id, false);

            if (response) {
                //setProfileInfo(response);  // Aggiorniamo lo stato con le informazioni del profilo
                reloadProfile();
                console.log("Invitation refused!")
            } else {
                console.error('Invalid response data');
            }
        } catch (error) {
            console.error('Error fetching profile information:', error);
        }
    };

    return (
        <div className="tripBlock invitation">
            <div id="tripBlockContent">
                <div id="title">{trip.title}</div>
                <div id="date"><i className="bi bi-calendar3 icon-with-margin"></i>{startDate} - {endDate}</div>
                <div id="location"><i className="bi bi-geo-alt icon-with-margin"></i>{locationString}</div>
                <div id="participants"><i className="bi bi-people icon-with-margin"></i>{participantsStr}</div>
            </div>
            <div id="buttonRow">
                <button onClick={acceptInvitation}>Accept</button>
                <button onClick={refuseInvitation}>Refuse</button>
            </div>
        </div>

    );
}

