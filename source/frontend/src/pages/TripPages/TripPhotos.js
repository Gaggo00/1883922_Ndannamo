import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import InternalMenu from "./InternalMenu";
import PhotoPreview from './Photos/PhotoPreview';
import PhotoModal from './Photos/PhotoModal';

import PhotoService from '../../services/PhotoService';
import TripService from '../../services/TripService';
import UserService from '../../services/UserService';

import DateUtilities from '../../utils/DateUtilities';

import './InternalMenu.css'
import "./TripPhotos.css"


export default function TripPhotos() {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();

    const [tripInfo, setTripInfo] = useState(location.state?.trip);
    const [profileInfo, setProfileInfo] = useState(location.state?.profile);

    useEffect(() => {
        fetchPhotoIds();
    }, []);


    // File contenente l'immagine caricata dall'utente
    const FILENAME_MAX_LENGTH = 20;
    const [filename, setFilename] = useState("");
    var file = null;
    function setFile(f) {
        file = f;
    }

    // Lista degli id delle foto
    const [imageIds, setImageIds] = useState([]);


    // Src dell'immagine aperta nel modal
    const [photoModalSrc, setPhotoModalSrc] = useState("");
    const [photoModalInfo, setPhotoModalInfo] = useState(null);

    const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
    const openPhotoModal = (imgSrc, photoInfo) => {
        setPhotoModalSrc(imgSrc);
        setPhotoModalInfo(photoInfo);
        setIsPhotoModalOpen(true);
    };
    const closePhotoModal = () => {
        setIsPhotoModalOpen(false);
    };
    const handleOverlayClick = (e) => {
        if (e.target.className === "modal-overlay") {
            closePhotoModal();
        }
    };


    // Per il caricamento dei file
    function handleChange(event) {

        var file = event.target.files[0];

        if (!file) {
            disableUploadButton();
        }

        const fileSizeKb = Math.round((file.size / 1024));
        if (fileSizeKb >= 1024) {
            alert("The photo you selected is too heavy. Only files up to 1Mb are supported.");
            disableUploadButton();
            return;
        }

        setFile(file);
        var name = file.name;
        if (name.length > FILENAME_MAX_LENGTH) {
            name = name.substring(0, FILENAME_MAX_LENGTH) + "...";
        }
        setFilename(name);
        
        enableUploadButton();
    }

    function disableUploadButton() {
        document.getElementById("upload-button").setAttribute('disabled', true);
    }
    function enableUploadButton() {
        document.getElementById("upload-button").removeAttribute('disabled');
        document.getElementById("upload-button").onclick = uploadPhoto;
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
                navigate("/error");
                console.error('Invalid response data');
            }
        } catch (error) {
            navigate("/error");
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
                fetchPhotoIds();
                
            } else {
                console.error('Invalid response data');
                alert("Server error");
            }
        } catch (error) {
            console.error('Error uploading photos:', error);
            alert("Couldn't upload photos, error:", error);
        }

        setFile(null);
        setFilename("");
        disableUploadButton();
    };


    // Per eliminare una foto
    const deletePhoto = async (photoId) => {
        if (photoId === -1) {
            return;
        }
        console.log("deleting photo, id: " + photoId);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate("/login");
            }

            const response = await PhotoService.deletePhoto(token, id, photoId);

            if (response) {
                closePhotoModal();
                fetchPhotoIds();
                
            } else {
                console.error('Invalid response data');
                alert("Server error");
            }
        } catch (error) {
            console.error('Error deleting photo:', error);
            alert("Couldn't delete photo, error:", error);
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
        <div className="trip-info">
            <InternalMenu tripInfo={tripInfo} profileInfo={profileInfo}/>
            {tripInfo ? (
                <div className="trip-content">
                    <div className="trip-top">
                        <span> <strong>{tripInfo.title}:</strong> {DateUtilities.yyyymmdd_To_ddMONTH(tripInfo.startDate)} - {DateUtilities.yyyymmdd_To_ddMONTH(tripInfo.endDate)}</span>
                    </div>
                    <div className="trip-details" >
                        <div className="gallery">
                            {imageIds.map((photoId) =>
                                <PhotoPreview photoId={photoId} tripId={id} openModal={openPhotoModal} key={photoId}/>
                            )}
                        </div>
                        <div id="buttons-area">
                            <div id="upload-buttons-row">
                                <input id="file-input" type="file" onChange={handleChange} hidden/>
                                <button id="choose-file-button" title="Choose a file" onClick={()=>{document.getElementById("file-input").click()}}>
                                    <h1><i className="bi bi-plus"/></h1>
                                </button>
                                <button id="upload-button" title="Upload" disabled>
                                    <h1><i className="bi bi-upload"/></h1>
                                </button>
                            </div>
                            {filename !== "" && (
                                    <div id="selected-file-name"><b>Selected:</b> {filename}</div>
                                )}
                        </div>
                    </div>
                </div>
            ) : (
                <p>Loading trip details...</p>          
            )}
            {isPhotoModalOpen && (
                <div className="modal-overlay" onClick={handleOverlayClick}>
                    <PhotoModal photoUrl={photoModalSrc} photoInfo={photoModalInfo} closeModal={closePhotoModal} deletePhoto={deletePhoto}/>
                </div>
            )}
        </div>
    );
}

