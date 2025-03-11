import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TripService from '../services/TripService';
import CityService from '../services/CityService';
import missingCityImage from '../static/missing_city_image.png'
import "../styles/TripPreview.css";
import DateUtilities from '../utils/DateUtilities';


export default function TripPreview({trip, reloadProfile}) {

    // caratteri max per la riga delle location e per la riga dei partecipanti
    const MAX_ROW_CHARACTERS = 29;

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

    
    var locationString = "";
    if (trip.locations.length > 0) {

        const mainLocation = trip.locations[0].split(",");
        const mainLocationName = mainLocation[0].trim();
        var  mainLocationCountry = "";
        if (mainLocation.length > 1) {
            mainLocationCountry = mainLocation[1].trim();
        }

        fecthImage(mainLocationName, mainLocationCountry);

        locationString = trip.locations[0];
        if (locationString.length > MAX_ROW_CHARACTERS) {
            locationString = locationString.substring(0, MAX_ROW_CHARACTERS-3) + "...";
        }
        else if (trip.locations.length > 1 && (locationString.length <= MAX_ROW_CHARACTERS-4)) {
            locationString += ", ...";
        }
    }

    
    const startDate = DateUtilities.yyyymmdd_To_ddmmyy(trip.startDate, "-", "/");
    const endDate = DateUtilities.yyyymmdd_To_ddmmyy(trip.endDate, "-", "/");


    var participantsStr = trip.list_participants[0].nickname;
    var participantsStrShortened = true;

    if (trip.list_participants.length > 1) {
        var temp = participantsStr + ", " + trip.list_participants[1].nickname;
        if (temp.length <= MAX_ROW_CHARACTERS) {
            participantsStr = temp;
            participantsStrShortened = false;
        }
        else if (participantsStr.length <= MAX_ROW_CHARACTERS-4) {
            participantsStr += ", ...";
        }
        else if (participantsStr.length > MAX_ROW_CHARACTERS) {
            participantsStr = participantsStr.substring(0, MAX_ROW_CHARACTERS-3) + "...";
        }
    }
    if (!participantsStrShortened && trip.list_participants.length > 2) {
        if (participantsStr.length <= MAX_ROW_CHARACTERS-12) {
            const quantity = trip.list_participants.length - 2;
            participantsStr += " and " + quantity + " more";
        }
        else if (participantsStr.length <= MAX_ROW_CHARACTERS-4) {
            participantsStr += ", ...";
        }
    }

    const handleClick = () => {
        navigate(`/trips/${trip.id}/summary`, {state: {trip: trip, profile:reloadProfile}}); // Modifica questa rotta in base alla struttura della tua applicazione
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
