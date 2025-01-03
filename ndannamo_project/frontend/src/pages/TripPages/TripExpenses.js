import React from 'react';
import {useLocation} from 'react-router-dom';
import InternalMenu from "./InternalMenu";
import './InternalMenu.css'

export default function TripExpenses() {
    const location = useLocation();
    const tripInfo = location.state?.trip; // Recupera il tripInfo dallo stato

    if (!tripInfo) {
        return <p>Loading trip details...</p>;
    }

    return (
        <div className="trip-info">
            <InternalMenu />
            <div className="trip-content">
                <div className="trip-top">
                    <span> <strong>{tripInfo.title}</strong> {tripInfo.startDate} {tripInfo.endDate}</span>
                </div>
                <div className="trip-details">
                    <div className="sezione1">
                        <h1>Trip Details</h1>
                        <p>Showing details for trip ID: {tripInfo.id}</p>
                    </div>
                    <div className="sezione2"></div>
                </div>
            </div>
        </div>
    );
}

