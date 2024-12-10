import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import UserService from '../services/UserService';

import logo from '../static/Logo app.png'
import "../styles/TripPreview.css";


export default function TripInvitation({trip, reloadProfile}) {

    const navigate = useNavigate();

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
        <div className="tripBlock">
            <p id="title">{trip.title}</p>
            <p id="date">{trip.startDate} - {trip.endDate}</p>
            <p>{trip.locations.toString()}</p>
            <p>{trip.list_participants.length} participants</p>
            <div id="buttonRow">
                <button onClick={acceptInvitation}>Accept</button>
                <button onClick={refuseInvitation}>Refuse</button>
            </div>
        </div>

    );
}

