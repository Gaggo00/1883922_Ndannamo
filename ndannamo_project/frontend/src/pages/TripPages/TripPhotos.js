import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import InternalMenu from "./InternalMenu";
import './InternalMenu.css'

import PhotoService from '../../services/PhotoService';
import TripService from '../../services/TripService';


export default function TripPhotos() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [file, setFile] = useState();

    const location = useLocation();
    const [tripInfo, setTripInfo] = useState(location.state?.trip);

    useEffect(() => {
        fetchPhotoIds();
        //fetchImage(2);
    }, []);


    const [imageUrls, setImageUrls] = useState([]);

    // Per far ricaricare le immagini quando gli url vengono ottenuti
    const [imagesKey, setImagesKey] = useState(0);

    const fetchImage = async (photoId) => {
        //console.log("fetching image of id: " + photoId);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate("/login");
            }

            const response = await PhotoService.getPhoto(token, id, photoId);

            if (response) {
                console.log("fetched image of id: " + photoId);
                const imageObjectURL = URL.createObjectURL(response);
                var urls = imageUrls;
                urls[photoId] = imageObjectURL;
                setImageUrls(urls);
                setImagesKey(imagesKey+1);
            } else {
                console.error('Invalid response data');
            }
        } catch (error) {
            console.error('Error fetching photos:', error);
        }
    };


    // Per il caricamento dei file
    function handleChange(event) {
        setFile(event.target.files[0])
    }

    // Per ottenere la lista di id
    const fetchPhotoIds = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate("/login");
            }

            // Chiamata al servizio per ottenere le informazioni del profilo
            const response = await PhotoService.getPhotoIds(token, 452);

            if (response) {
                console.log(response);
                // response e' una lista di id, tipo [21, 45]

                // inizializzo imageUrls con una stringa vuota per ogni id
                setImageUrls([...new Array(response.length)].map(() => ""));

                // poi faccio il fetch delle immagini e quando le ho ottenute sostituisco
                // gli url con quelli veri
                response.forEach(photoId => {
                    fetchImage(photoId);
                });

            } else {
                console.error('Invalid response data');
            }
        } catch (error) {
            console.error('Error fetching photos:', error);
        }
    }

    const uploadPhoto = async () => {
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
            }
        } catch (error) {
            console.error('Error uploading photos:', error);
        }
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
                    <div className="trip-details" key={imagesKey}>
                        <div className='flex-row'>
                            {imageUrls.map((url, index) =>
                                <img src={imageUrls[index]} key={index}></img>
                            )}
                        </div>
                        <input type="file" onChange={handleChange}/>
                        <button onClick={uploadPhoto}>upload</button>

                    </div>
                </div>
            ) : (
                <p>Loading trip details...</p>          
            )}
        </div>
    );
}

