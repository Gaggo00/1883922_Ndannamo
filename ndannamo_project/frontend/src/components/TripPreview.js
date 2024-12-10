import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import logo from '../static/Logo app.png'
import "../styles/TripPreview.css";


export default function TripPreview({trip}) {

    //const navigate = useNavigate();

    return (
        <div className="tripBlock">
            <p id="title">{trip.title}</p>
            <p id="date">{trip.startDate} - {trip.endDate}</p>
            <p>{trip.locations.toString()}</p>
            <p>{trip.list_participants.length} participants</p>
        </div>

    );
}

