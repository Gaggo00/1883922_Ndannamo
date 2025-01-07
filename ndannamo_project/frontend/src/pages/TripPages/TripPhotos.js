import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import TripService from "../../services/TripService";
import InternalMenu from "./InternalMenu";
import './InternalMenu.css'

export default function TripPhotos() {
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
            const response = await TripService.getTrip(token, id);

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
