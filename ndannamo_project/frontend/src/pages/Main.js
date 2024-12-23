import {React, useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";

import TripService from '../services/TripService';

import MultiStepForm from "../components/TripCreationForm/MultiStepForm/MultiStepForm";
import TripSideBarPreview from "../components/TripSideBarPreview";
import TripPreview from '../components/TripPreview'

import "../styles/Main.css";
import '../components/TripCreationForm/TripCreation.css';
import banner from "../static/svg/trips-banner.svg"


function Main() {

    /*
    const [profileInfo, setProfileInfo] = useState({
        nickname: '',
        email: '',
        trips: [],
        invitations : []
    });
    */
    const navigate = useNavigate();
    const [upcomingTrips, setupcomingTrips] = useState([]);
    const [pastTrips, setPastTrips] = useState([]);
    

    useEffect(() => {
        fetchTripsInfo();
    }, []);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleOverlayClick = (e) => {
        // Verifica se l'utente ha cliccato sull'overlay e non sul contenuto del modal
        if (e.target.className === "modal-overlay") {
            closeModal();
        }
    };

    const fetchTripsInfo = async () => {
        try {
            const token = localStorage.getItem('token'); // Recuperiamo il token da localStorage
            if (!token) {
                navigate("/login");
            }

            // Chiamata al servizio per ottenere le informazioni del profilo
            const response = await TripService.getTrips(token);

            if (response) {
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

    return (
        <div className="main">
            <div className="sidebar">
                <button onClick={openModal}>+ Create a trip</button>
                <div className="trip-list">
                    <h2>Upcoming trips</h2>
                    {upcomingTrips.map((trip, index) =>
                        <TripSideBarPreview key={index} trip={trip} reloadProfile={null}></TripSideBarPreview>
                    )}
                    <h2>Past Trips</h2>
                    {pastTrips.map((trip, index) =>
                        <TripSideBarPreview key={index} trip={trip} reloadProfile={null}></TripSideBarPreview>
                    )}
                </div>
            </div>
            <div className="content">
                {/* BARRA DI RICERCA */}
                <div className="search-bar">
                    <i className="bi bi-search"></i>
                    <input type="text" placeholder="Search a trip"/>
                </div>
                {/*<div className="header"></div>*}
                {/* BANNER */}
                <div id='banner'>
                    <img id="bannerImg" src={banner}></img>
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
                        {
                        // TEMPORANEO per test, poi andra' cambiato "upcomingTrips" con "pastTrips"
                        upcomingTrips.map((trip, index) =>
                            <TripPreview key={index} trip={trip} reloadProfile={null}></TripPreview>
                        )}
                    </div>
                </div>
            </div>
            {isModalOpen && (
                <div className="modal-overlay" onClick={handleOverlayClick}>
                    <div className="trip-box">
                        <MultiStepForm/>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Main;
