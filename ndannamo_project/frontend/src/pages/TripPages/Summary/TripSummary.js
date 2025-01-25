import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import InternalMenu from "../InternalMenu";
import "./TripSummary.css";
import DateUtilities from "../../../utils/DateUtilities";
import DateSummary from './DateSummary';
import DestinationSummary from './DestinationSummary';
import ParticipantsSummary from './ParticipantsSummary';

export default function TripSummary() {
    const location = useLocation();
    const tripInfo = location.state?.trip; // Recupera il tripInfo dallo stato
    const profileInfo = location.state?.profile; // Recupera il tripInfo dallo stato

    return (
        <div className="trip-info">
            <InternalMenu />
            <div className="trip-content">
                <div className="trip-top">
                    <span>
                        <strong>{tripInfo.title}</strong> {DateUtilities.yyyymmdd_To_ddmm(tripInfo.startDate, "-", "/")} - {DateUtilities.yyyymmdd_To_ddmm(tripInfo.endDate, "-", "/")}
                    </span>
                </div>
                <div className="trip-details">
                    <ParticipantsSummary/>
                    <div className="other-section">
                        <DestinationSummary />
                        <DateSummary />
                    </div>
                </div>
            </div>
        </div>
    );
}
