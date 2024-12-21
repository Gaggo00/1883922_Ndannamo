import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/TripPreview.css";


export default function TripSideBarPreview({trip, reloadProfile}) {

    const navigate = useNavigate();


    return (
        <div className="trip-item">
            <p id="title">{trip.title}</p>
            <small id="date">{trip.startDate} - {trip.endDate}</small>
        </div>

    );
}

