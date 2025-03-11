import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import InternalMenu from "./InternalMenu";

import PhotoPreview from './Photos/PhotoPreview';

import PhotoService from '../../services/PhotoService';
import TripService from '../../services/TripService';

import './InternalMenu.css'
import "./TripPhotos.css"
import AttachmentService from "../../services/AttachmentService";


export default function TripPhotos() {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();

    const [tripInfo, setTripInfo] = useState(location.state?.trip);

    useEffect(() => {
        fetchPhotoIds();
    }, []);


    // File contenente l'immagine caricata dall'utente
    const [file, setFile] = useState();

    // Lista degli id delle foto
    const [imageIds, setImageIds] = useState([]);


    // Src dell'immagine aperta nel modal
    const [modalImgSrc, setModalImgSrc] = useState("");
    const [modalImgName, setModalImgName] = useState("");          // ancora da far restituire al backend
    const [modalImgId, setModalImgId] = useState(-1);
    const [modalImgDescription, setModalImgDescription] = useState("descrizione");     // da vedere se la vogliamo mettere, per ora il backend non la restituisce
    const [modalImgUploadedBy, setModalImgUploadedBy] = useState("persona");       // ancora da far restituire al backend


    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = (imgSrc, imgName, imgId, imgUploadedBy) => {
        setModalImgSrc(imgSrc);
        setModalImgName(imgName);
        setModalImgId(imgId);
        setModalImgUploadedBy(imgUploadedBy);
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setIsModalOpen(false);
    };
    const handleOverlayClick = (e) => {
        if (e.target.className === "modal-overlay") {
            closeModal();
        }
    };


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
            const response = await AttachmentService.uploadPhoto(token, id, file);

            if (response) {
                console.log(response);
                window.location.reload(); 
                
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


    // Per eliminare una foto
    const deletePhoto = async (photoId) => {
        if (photoId == -1) {
            return;
        }
        console.log("deleting photo, id: " + photoId);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate("/login");
            }

            const response = await AttachmentService.deleteAttachment(token, photoId);

            if (response) {
                closeModal();
                window.location.reload(); 
                
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
                                <PhotoPreview photoId={photoId} tripId={id} openModal={openModal} key={photoId}/>
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
            {isModalOpen && (
                <div className="modal-overlay" onClick={handleOverlayClick}>
                    <div className="photo-open">
                        <div className='flex-row justify-content-space-around photo-open-top-bar'>
                            <p>{modalImgName}</p>
                            <button onClick={() => {deletePhoto(modalImgId)}}>delete</button>
                        </div>
                        <img src={modalImgSrc}/>
                        <div className='photo-open-bottom-bar'>
                            <p>Uploaded by {modalImgUploadedBy}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

