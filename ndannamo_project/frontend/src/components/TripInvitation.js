import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css'
import UserService from '../services/UserService';
import logo from '../static/Logo app.png'


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
        <div>
            <p>{trip.title}</p>
            <p>{trip.startDate} - {trip.endDate}</p>
            <p>{trip.locations.toString()}</p>
            <p>{trip.list_participants.length} participants</p>
            <button onClick={acceptInvitation}>Accept</button>
            <button onClick={refuseInvitation}>Refuse</button>
        </div>

    );
}

