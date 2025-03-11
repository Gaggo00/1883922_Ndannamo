import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';


import PhotoService from '../../../services/PhotoService';

import "../TripPhotos.css"
import AttachmentService from "../../../services/AttachmentService";


export default function PhotoPreview({photoId, tripId, openModal}) {

    const navigate = useNavigate();

    const [imgURL, setImgURL] = useState("");
    const [imgKey, setimgKey] = useState(0);


    useEffect(() => {
        fetchImage(photoId);
    }, []);

    const fetchImage = async (photoId) => {
        //console.log("fetching image of id: " + photoId);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate("/login");
            }

            const response = await AttachmentService.getPhoto(token, tripId, photoId);

            if (response) {
                console.log("fetched image of id: " + photoId);
                const imageObjectURL = URL.createObjectURL(response);

                setImgURL(imageObjectURL);
                setimgKey(1);
            } else {
                console.error('Invalid response data');
            }
        } catch (error) {
            console.error('Error fetching photos:', error);
        }
    };


    return (
        <div className="gallery-item">
            <img src={imgURL} key={imgKey} onClick={() => {openModal(imgURL, "nome foto", photoId, "persona")}}/>
        </div>
    );
}