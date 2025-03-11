import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import UserService from '../services/UserService';
import CityService from '../services/CityService';
import ConfirmDelete from '../common/ConfirmDelete';

import missingCityImage from '../static/missing_city_image.png'
import "../styles/TripPreview.css";
import "./TripInvitation.css";
import "../styles/Common.css";

import DateUtilities from '../utils/DateUtilities';


export default function TripInvitation({trip, reloadProfile}) {

    const navigate = useNavigate();

    // Per il pop up di conferma rifiuto invito
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleOverlayClick = (e) => {
        // Verifica se l'utente ha cliccato sull'overlay e non sul contenuto del modal
        if (e.target.className === "modal-overlay") {
            setIsModalOpen(false);
        }
    };


    const startDate = DateUtilities.yyyymmdd_To_ddmmyy(trip.startDate, "-", "/");
    const endDate = DateUtilities.yyyymmdd_To_ddmmyy(trip.startDate, "-", "/");


    var locationString = "";
    for (var i = 0; i < trip.locations.length - 1; i++) {
        locationString += ", " + trip.locations[i];
    }
    locationString += trip.locations[trip.locations.length - 1];


    var participantsStr = "";
    for (var i = 0; i < trip.list_participants.length - 1; i++) {
        participantsStr += ", " + trip.list_participants[i];
    }
    participantsStr += trip.list_participants[trip.list_participants.length - 1];


    const [imgURL, setImgURL] = useState(missingCityImage);
    const [imageKey, setimageKey] = useState(0);    // serve per far aggiornare l'immagine

    const fecthImage = async (name, country) => {
        try {
            const response = await CityService.getCityImage(name, country);

            if (response) {
                //console.log(response);
                if (response.length > 7 && response.substring(0,6) === "https:") {
                    //console.log("sto cambiando url immagine");
                    setImgURL(response);
                    setimageKey(1);
                }
            } else {
                console.error('Invalid response data');
            }
        } catch (error) {
            console.error('Error fetching image url:', error);
        }
    }

    if (trip.locations.length > 0) {
        const mainLocation = trip.locations[0].split(",");
        const mainLocationName = mainLocation[0].trim();
        var  mainLocationCountry = "";
        if (mainLocation.length > 1) {
            mainLocationCountry = mainLocation[1].trim();
        }
        fecthImage(mainLocationName, mainLocationCountry);
    }


    const acceptInvitation = async () => {
        try {
            const token = localStorage.getItem('token'); // Recuperiamo il token da localStorage
            if (!token) {
                navigate("/login");
            }
            // Chiamata al servizio per accettare
            const response = await UserService.acceptInvitation(token, trip.id, true);

            if (response) {
                setIsModalOpen(false);
                reloadProfile();
                console.log("Invitation accepted!")
                alert("You accepted the invitation!");
            } else {
                console.error('Invalid response data');
                alert("Server error");
            }
        } catch (error) {
            console.error('Error accepting invitation:', error);
            alert("Couldn't accept invitation: " + error);
        }
        setIsModalOpen(false);
    };

    const refuseInvitation = async () => {
        try {
            const token = localStorage.getItem('token'); // Recuperiamo il token da localStorage
            if (!token) {
                navigate("/login");
            }
            // Chiamata al servizio per accettare
            const response = await UserService.acceptInvitation(token, trip.id, false);

            if (response) {
                //setProfileInfo(response);  // Aggiorniamo lo stato con le informazioni del profilo
                setIsModalOpen(false);
                reloadProfile();
                console.log("Invitation refused!");
                alert("You refused the invitation!");
            } else {
                console.error('Invalid response data');
                alert("Server error");
            }
        } catch (error) {
            console.error('Error refusing invitation:', error);
            alert("Couldn't refuse invitation: " + error);
        }
        setIsModalOpen(false);
    };

    return (
        <div className="tripBlockInvitation flex-row">
            <div id="imageContainer">
                <img src={imgURL} key={imageKey} alt="location-image"></img>
            </div>
            <div className="tripBlockContentInvitation flex-column text-align-left justify-content-space-between">
                <div id="title">{trip.title}</div>
                <div>
                    <div id="date"><i className="bi bi-calendar3 icon-with-margin"></i>{startDate} - {endDate}</div>
                    <div id="location"><i className="bi bi-geo-alt icon-with-margin"></i>{locationString}</div>
                    <div id="participants"><i className="bi bi-people icon-with-margin"></i>{participantsStr}</div>
                </div>
                <div id="createdBy"><i>Created by {trip.createdByName}</i></div>
            </div>
            <div className="button-row flex-column justify-content-center" >
                <button className="invitation-button accept-button" onClick={acceptInvitation}>Accept</button>
                <button className="invitation-button refuse-button" onClick={() => {setIsModalOpen(true)}}>Refuse</button>
            </div>
            {isModalOpen && (
                <div className="modal-overlay" onClick={handleOverlayClick}>
                    <div className="trip-box">
                        <ConfirmDelete
                            message={"Do you really want to refuse the invitation to \"" + trip.title + "\"?"}
                            onConfirm={refuseInvitation}
                            onClose={()=>{setIsModalOpen(false);}}/>
                    </div>
                </div>
            )} 
        </div>

    );
}

