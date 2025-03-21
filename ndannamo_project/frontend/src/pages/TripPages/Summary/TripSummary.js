import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

import TripService from "../../../services/TripService";
import UserService from "../../../services/UserService";

import InternalMenu from "../InternalMenu";
import DateSummary from './DateSummary';
import DestinationSummary from './DestinationSummary';
import ParticipantsSummary from './ParticipantsSummary';

import DateUtilities from "../../../utils/DateUtilities";

import "./TripSummary.css";



export default function TripSummary() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [tripInfo, setTripInfo] = useState(location.state?.trip);
    const [profileInfo, setProfileInfo] = useState(location.state?.profile);


    const fetchTripInfo = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate("/login");
            }
            const response = await TripService.getTrip(token, id);
            if (response) {
                console.log("obtained trip info");
                setTripInfo(response);
                
            } else {
                console.error('Invalid response data');
            }
        } catch (error) {
            console.error('Error fetching trip info:', error);
        }
    }
    if (!tripInfo) {
        fetchTripInfo();
    }
    const fetchProfileInfo = async () => {
        try {
            const token = localStorage.getItem('token'); // Recuperiamo il token da localStorage
            if (!token) {
                navigate("/login");
            }

            // Chiamata al servizio per ottenere le informazioni del profilo
            const response = await UserService.getProfile(token);

            if (response) {
                setProfileInfo(response);  // Aggiorniamo lo stato con le informazioni del profilo
            } else {
                console.error('Invalid response data');
            }
        } catch (error) {
            console.error('Error fetching profile information:', error);
        }
    };
    if (!profileInfo) {
        fetchProfileInfo();
    }


    return (
        <div>
            {tripInfo && profileInfo &&
            <div className="trip-info">
                <InternalMenu tripInfo={tripInfo}/>
                <div className="trip-content">
                    <div className="trip-top">
                        <span> <strong>{tripInfo.title}:</strong> {DateUtilities.yyyymmdd_To_ddMONTH(tripInfo.startDate)} - {DateUtilities.yyyymmdd_To_ddMONTH(tripInfo.endDate)}</span>
                    </div>
                    <div className="trip-details">
                        <ParticipantsSummary tripInfoParam={tripInfo} profileInfo={profileInfo}/>
                        <div className="other-section">
                            <DestinationSummary tripInfo={tripInfo} profileInfo={profileInfo}/>
                            <DateSummary tripInfo={tripInfo} profileInfo={profileInfo}/>
                        </div>
                    </div>
                </div>
            </div>
            }
        </div>
    );
}
