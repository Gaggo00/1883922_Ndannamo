import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/TripPreview.css";


export default function TripMainPreview({trip, reloadProfile}) {

    const navigate = useNavigate();


    return (
        <div className="trip-card">
            <div className="image-location"></div>
            <p id="title">{trip.title}</p>
            <p id="date">{trip.startDate} - {trip.endDate}</p>
            <p id="location"> {trip.locations.toString()}</p>
        </div>

    );
}

