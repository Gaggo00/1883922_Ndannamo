import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/TripPreview.css";
import DateUtilities from '../utils/DateUtilities';


export default function TripSideBarPreview({trip, reloadProfile}) {


    return (
        <div className="trip-item">
            <p id="title">{trip.title}</p>
            <small id="date">{DateUtilities.yyyymmdd_To_ddmmyy(trip.startDate, "-", "/")} - {DateUtilities.yyyymmdd_To_ddmmyy(trip.endDate, "-", "/")}</small>
        </div>
    );
}

