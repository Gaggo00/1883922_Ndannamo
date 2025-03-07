import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import InternalMenu from "./InternalMenu";

import PhotoPreview from './Photos/PhotoPreview';

import PhotoService from '../../services/PhotoService';
import TripService from '../../services/TripService';

import './InternalMenu.css'
import "./TripPhotos.css"


export default function TripPhotos() {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();

    const [file, setFile] = useState();

    const [tripInfo, setTripInfo] = useState(location.state?.trip);

    useEffect(() => {
        fetchPhotoIds();
    }, []);

    const [imageIds, setImageIds] = useState([]);


    // Per il caricamento dei file
    function handleChange(event) {
        setFile(event.target.files[0]);
        /*
        if (event.target.files[0]) {
            document.getElementById("upload-button").removeAttribute('disabled');
        }
        */
    }

    // Per ottenere la lista di id
    const fetchPhotoIds = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate("/login");
            }

            // Chiamata al servizio per ottenere le informazioni del profilo
            const response = await PhotoService.getPhotoIds(token, id);

            if (response) {
                console.log(response);
                setImageIds(response);
            } else {
                console.error('Invalid response data');
            }
        } catch (error) {
            console.error('Error fetching photos:', error);
        }
    }


    // Per caricare una nuova foto
    const uploadPhoto = async () => {
        if (!file) {
            console.log("no file selected");
            alert("Choose a file first");
            return;
        }
        console.log("uploading photo");
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate("/login");
            }

            // Chiamata al servizio per ottenere le informazioni del profilo
            const response = await PhotoService.uploadPhoto(token, id, file);

            if (response) {
                console.log(response);
                
            } else {
                console.error('Invalid response data');
                alert("Server error");
            }
        } catch (error) {
            console.error('Error uploading photos:', error);
            alert("Couldn't upload photos, error:", error);
        }

        setFile(null);
        //document.getElementById("upload-button").setAttribute('disabled', '');
    };


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

    return (
        <div className="trip-info">
            <InternalMenu />
            {tripInfo ? (
                <div className="trip-content">
                    <div className="trip-top">
                        <span> <strong>{tripInfo.title}</strong> {tripInfo.startDate} {tripInfo.endDate}</span>
                    </div>
                    <div className="trip-details" >
                        <div className="gallery">
                            {imageIds.map((photoId) =>
                                <PhotoPreview photoId={photoId} tripId={id} key={photoId}/>
                            )}
                        </div>
                        <div id="upload-buttons-row">
                            <input type="file" onChange={handleChange}/>
                            <button id="upload-button" onClick={uploadPhoto}>upload</button>
                        </div>
                    </div>
                </div>
            ) : (
                <p>Loading trip details...</p>          
            )}
        </div>
    );
}

