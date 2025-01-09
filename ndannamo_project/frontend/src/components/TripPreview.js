import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TripService from '../services/TripService';
import CityService from '../services/CityService';
import missingCityImage from '../static/missing_city_image.png'
import "../styles/TripPreview.css";
import DateUtilities from '../utils/DateUtilities';


export default function TripPreview({trip, reloadProfile}) {

    const navigate = useNavigate();
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

    const mainLocation = trip.locations[0].split(",");
    const mainLocationName = mainLocation[0].trim();
    var  mainLocationCountry = "";
    if (mainLocation.length > 1) {
        mainLocationCountry = mainLocation[1].trim();
    }

    fecthImage(mainLocationName, mainLocationCountry);

    const startDate = DateUtilities.yyyymmdd_To_ddmmyy(trip.startDate, "-", "/");
    const endDate = DateUtilities.yyyymmdd_To_ddmmyy(trip.endDate, "-", "/");

    var locationString = trip.locations[0];
    if (trip.locations.length > 1) {
        locationString += ", ...";
    }

    var participantsStr = trip.list_participants[0];
    if (trip.list_participants.length > 1) {
        participantsStr += ", " + trip.list_participants[1];
    }
    if (trip.list_participants.length > 2) {
        const quantity = trip.list_participants.length - 2;
        participantsStr += " and " + quantity + " more";
    }

    const handleClick = () => {
        navigate(`/trips/${trip.id}/summary`); // Modifica questa rotta in base alla struttura della tua applicazione
    };



    // TEMPORANEA, andra' spostata nella pagina specifica di questa trip
    const leaveTrip = async () => {
        try {
            const token = localStorage.getItem('token'); // Recuperiamo il token da localStorage
            if (!token) {
                navigate("/login");
            }
            // Chiamata al servizio per accettare
            const response = await TripService.leaveTrip(token, trip.id);

            if (response) {
                //setProfileInfo(response);  // Aggiorniamo lo stato con le informazioni del profilo
                reloadProfile();
                console.log("Invitation accepted!")
            } else {
                console.error('Invalid response data');
            }
        } catch (error) {
            console.error('Error fetching profile information:', error);
        }
    };


    return (
        <div className="tripBlock" onClick={handleClick}>
            <div id="imageContainer">
                <img id="image" src={imgURL} key={imageKey} alt="location-image"></img>
            </div>
            <div id="tripBlockContent">
                <div id="title">{trip.title}</div>
                <div id="date"><i className="bi bi-calendar3 icon-with-margin"></i>{startDate} - {endDate}</div>
                <div id="location"><i className="bi bi-geo-alt icon-with-margin"></i>{locationString}</div>
                <div id="participants"><i className="bi bi-people icon-with-margin"></i>{participantsStr}</div>
            </div>
        </div>
    );
}
