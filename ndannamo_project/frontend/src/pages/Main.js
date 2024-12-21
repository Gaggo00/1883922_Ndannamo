import {React, useEffect, useState} from 'react';
import "../styles/Main.css";
import MultiStepForm from "../components/TripCreationForm/MultiStepForm/MultiStepForm";
import '../components/TripCreationForm/TripCreation.css';
import TripMainPreview from "../components/TripMainPreview";
import UserService from "../services/UserService";
import {useNavigate} from "react-router-dom";
import TripSideBarPreview from "../components/TripSideBarPreview";

function Main() {

    const [profileInfo, setProfileInfo] = useState({
        nickname: '',
        email: '',
        trips: [],
        invitations : []
    });
    const navigate = useNavigate();

    useEffect(() => {
        fetchProfileInfo();
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

    return (
        <div className="main">
            <div className="sidebar">
                <button onClick={openModal}>+ Create a trip</button>
                <div className="trip-list">
                    <h3>Upcoming trips</h3>
                    {profileInfo.trips.map((trip, index) =>
                        <TripSideBarPreview key={index} trip={trip} reloadProfile={fetchProfileInfo}></TripSideBarPreview>
                    )}
                    <h3>Past Trips</h3>
                    <div className="trip-item">Londra<br /><small>22/03 - 26/03</small></div>
                    <div className="trip-item">Madrid<br /><small>22/03 - 26/03</small></div>
                    <div className="trip-item">Gaeta<br /><small>22/03 - 26/03</small></div>
                    <div className="trip-item">Capodanno<br /><small>22/03 - 26/03</small></div>
                </div>
            </div>
            <div className="content">
                <div className="search-bar">
                    <i className="bi bi-search"></i>
                    <input type="text" placeholder="Search your trip"/>
                </div>
                <div className="header"></div>
                <h3>Upcoming trips</h3>
                <div className="container-trip">
                    <div className="trip-grid">
                            {profileInfo.trips.map((trip, index) =>
                                <TripMainPreview key={index} trip={trip} reloadProfile={fetchProfileInfo}></TripMainPreview>
                            )}
                    </div>
                </div>
                <h3>Past Trips</h3>
                <div className="container-trip">
                    <div className="trip-grid">
                        <div className="trip-card past">Londra<br/><small>22/03 - 26/03</small></div>
                        <div className="trip-card past">Madrid<br/><small>22/03 - 26/03</small></div>
                        <div className="trip-card past">Gaeta<br/><small>22/03 - 26/03</small></div>
                        <div className="trip-card past">Capodanno<br/><small>22/03 - 26/03</small></div>
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
