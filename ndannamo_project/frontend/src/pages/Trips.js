import React, { useState, useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
import logo from "../static/Logo app.png"
import {useAuth} from "../auth/AuthContext";

import TripService from '../services/TripService';
import TripPreview from '../components/TripPreview.js'

import ondaVerde from "../static/wave/Onda2_Verda.png"
import ondaArancione from "../static/wave/Onda1_Arancione.png"
import TripsBanner from "../static/svg/TripsBanner.js"

import "../styles/Home.css"
import "../styles/Trips.css"

export default function Trips() {
    
    //const {isAuthenticated, logout} = useAuth();
    //const [trips, setTrips] = useState([]);
    const [upcomingTrips, setupcomingTrips] = useState([]);
    const [pastTrips, setPastTrips] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        fetchTripsInfo();
    }, []);

    const fetchTripsInfo = async () => {
        try {
            const token = localStorage.getItem('token'); // Recuperiamo il token da localStorage
            if (!token) {
                navigate("/login");
            }

            // Chiamata al servizio per ottenere le informazioni del profilo
            const response = await TripService.getTrips(token);

            if (response) {
                //setTrips(response);  // Aggiorniamo lo stato con le informazioni del profilo

                var _upcomingTrips = [];
                var _pastTrips = [];
                const today = Date.now();
                //console.log("today: " + today.toString())
                
                for (const trip of response) {

                    const endDate = Date.parse(trip.endDate)
                    //console.log("end: " + endDate.toString())

                    // e' "past" quando la sua endDate e' prima di oggi, quindi minore
                    if (endDate < today) {
                        _pastTrips.push(trip);
                    }
                    else {
                        _upcomingTrips.push(trip);
                    }
                }
                setupcomingTrips([..._upcomingTrips]);
                setPastTrips([..._pastTrips]);
                
            } else {
                console.error('Invalid response data');
            }
        } catch (error) {
            console.error('Error fetching trips information:', error);
        }
    };

    const goToCreateTrip = () => {
        navigate("/main");
    }


    return (
        <div className="page">
            {/*<img id="top" src={ondaVerde}/>*/}
            <div id='trips'>
                <div className='leftSection'>
                    <button onClick={goToCreateTrip}>Create Trip</button>
                </div>
                <div className='centerSection'>
                    {/* BARRA DI RICERCA */}
                    <div id='searchBarDiv'>
                        <input type='text' id='searchBar' placeholder='Search a trip...'/>
                    </div>
                    {/* BANNER */}
                    <div id='banner'>
                        {/*<img id="bannerImg" src={banner}/>*/}
                        <TripsBanner/>
                    </div>
                    {/* UPCOMING TRIPS */}
                    <div id='upcomingTrips'>
                        <h2>Upcoming trips</h2>
                        <div className='tripPreviewBlocksContainer'>
                            {upcomingTrips.map((trip, index) =>
                                <TripPreview key={index} trip={trip} reloadProfile={null}></TripPreview>
                            )}
                        </div>
                    </div>
                    {/* PAST TRIPS */}
                    <div id='pastTrips'>
                        <h2>Past trips</h2>
                        <div className='tripPreviewBlocksContainer'>
                            {pastTrips.map((trip, index) =>
                                <TripPreview key={index} trip={trip} reloadProfile={null}></TripPreview>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {/*<img id="bottom" src={ondaArancione}/>*/}
        </div>

    )
        ;
}

