import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import TripService from "../../services/TripService";
import InternalMenu from "./InternalMenu";
import './InternalMenu.css'

export default function TripInfo() {
    const { id } = useParams();
    const [tripInfo, setTripInfo] = useState({
        id:'',
        title: '',
        locations: [],
        creationDate:'',
        startDate : '',
        endDate : '',
        createdBy:'',
        list_participants: []
    });
    const navigate = useNavigate();

    useEffect(() => {
        fetchTripInfo();
    }, []);

    const fetchTripInfo = async () => {
        try {
            const token = localStorage.getItem('token'); // Recuperiamo il token da localStorage
            if (!token) {
                navigate("/login");
            }

            // Chiamata al servizio per ottenere le informazioni del profilo
            const response = await TripService.getTrip(id,token);

            if (response) {
                setTripInfo(response);
            } else {
                console.error('Invalid response data');
            }
        } catch (error) {
            console.error('Error fetching profile information:', error);
        }
    };

    return (
        <div className="trip-info">
            <InternalMenu/>
            <div className="trip-content">
                <div className="trip-top">
                    <p><bold>{tripInfo.title}</bold></p>
                </div>
                <h1>Trip Details</h1>
                <p>Showing details for trip ID: {tripInfo.id}</p>

            </div>
        </div>
    );
}
