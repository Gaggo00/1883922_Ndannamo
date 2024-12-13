import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

import TripService from '../services/TripService';

import logo from '../static/Logo app.png'
import "../styles/TripPreview.css";


export default function TripPreview({trip, reloadProfile}) {

    const navigate = useNavigate();

    const [imgURL, setImgURL] = useState("");

    const startDateArray = trip.startDate.split("-");
    const startDate = startDateArray[2] + "/" + startDateArray[1] + "/" + startDateArray[0].substring(2)
    const endDateArray = trip.endDate.split("-");
    const endDate = endDateArray[2] + "/" + endDateArray[1] + "/" + endDateArray[0].substring(2)

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


    useEffect(() => {
        fetchImage();
    }, []);

    const fetchImage = async () => {
        const query = trip.locations[0];
        
        //const url = `https://images.search.yahoo.com/search/images;?p=${query}`;
        const url = `https://serpapi.com/playground?engine=yahoo_images&p=${query}`

        try {
            const response = await axios.get(`${url}`);
            //var firstImage = response.getElementsByTagName("img")[0];
            //console.log(firstImage.src)
            console.log(response.data.images_results[0]);
        } catch (error) {
            throw error; // L'errore sarà gestito all'esterno
        }
    }


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
        <div className="tripBlock">
            <img id="image" src={imgURL}></img>
            <div id="tripBlockContent">
                <div id="title">{trip.title}</div>
                <div id="date"><i class="bi bi-calendar3 icon-with-margin"></i>{startDate} - {endDate}</div>
                <div id="location"><i class="bi bi-geo-alt icon-with-margin"></i>{locationString}</div>
                <div id="participants"><i class="bi bi-people icon-with-margin"></i>{participantsStr}</div>
            </div>
        </div>
    );
}


/*


        <Card sx={{ maxWidth: 345 }}>
            <CardActionArea>
            <CardMedia
                component="img"
                height="140"
                image="/static/images/cards/contemplative-reptile.jpg"
                alt="green iguana"
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                {trip.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {trip.startDate} - {trip.endDate}<br/>
                Lizards are a widespread group of squamate reptiles, with over 6,000
                species, ranging across all continents except Antarctica
                </Typography>
            </CardContent>
            </CardActionArea>
        </Card>
*/