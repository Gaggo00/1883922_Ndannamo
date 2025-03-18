import React, { useState, useEffect } from 'react';
import {useNavigate} from 'react-router-dom';


import PhotoService from '../../../services/PhotoService';

import "../TripPhotos.css"


export default function PhotoPreview({photoId, tripId, openModal}) {

    const navigate = useNavigate();

    const [imgURL, setImgURL] = useState("");
    const [imgKey, setimgKey] = useState(0);

    const [photoInfo, setPhotoInfo] = useState({
        "id": -1,
        "name": "",
        "type": "",
        "uploadDate": null,
        "tripId": -1,
        "uploadedBy": {
            "id": -1,
            "nickname": "",
            "email": ""
        },
        "description": "",
        "imageData":""
    })

    useEffect(() => {
        fetchImage(photoId);
        fetchImageInfo(photoId);
    }, [photoId]);

    async function fetchImage(photoId) {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate("/login");
            }

            const response = await PhotoService.getPhoto(token, tripId, photoId);

            if (response) {
                console.log("fetched image of id: " + photoId);
                //setPhoto(response);
                const imageObjectURL = URL.createObjectURL(response);

                setImgURL(imageObjectURL);
                setimgKey(1);
            } else {
                console.error('Invalid response data');
            }
        } catch (error) {
            console.error('Error fetching photo:', error);
        }
    };

    async function fetchImageInfo(photoId) {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate("/login");
            }

            const response = await PhotoService.getPhotoInfo(token, tripId, photoId);

            if (response) {
                setPhotoInfo(response);
            } else {
                console.error('Invalid response data');
            }
        } catch (error) {
            console.error('Error fetching photo info:', error);
        }
    };


    return (
        <div className="gallery-item">
            <img src={imgURL} key={imgKey} onClick={() => {openModal(imgURL, photoInfo)}} alt={photoInfo.name}/>
        </div>
    );
}