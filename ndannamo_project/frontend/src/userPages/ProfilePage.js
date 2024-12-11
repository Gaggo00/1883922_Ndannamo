import React, { useState, useEffect } from 'react';
import UserService from '../services/UserService';
import TripPreview from '../components/TripPreview.js'
import TripInvitation from '../components/TripInvitation.js'
import passport from '../static/Passport.png';
import { useNavigate } from 'react-router-dom';

import ondaVerde from "../static/wave/Onda2_Verda.png"
import ondaArancione from "../static/wave/Onda1_Arancione.png"

import "../styles/ProfilePage.css";
import "../styles/TripPreview.css";

function ProfilePage() {
    // Impostiamo un valore di default per profileInfo
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

    const handlePasswordChange = () => {
        navigate('/change-password');
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
        <div className="page">
            {/*<div id="color"></div>*/}
            <img id="top" src={ondaVerde}/>
            <div className="profile-page-container">
                {/*<h2>Profile Information</h2>*/}
                <div id="profile-content">
                    <div id="image-box">
                        <img src={passport} alt="User's passport photo" />
                    </div>
                    <div id="scritte">
                        <h2>Profile Information</h2>
                        <p><strong>Username:</strong> {profileInfo.nickname}</p>
                        <p><strong>Email:</strong> {profileInfo.email}</p>
                        <div id="pass">
                            <p><strong>Password:</strong></p>
                            <button onClick={handlePasswordChange}>Change password</button>
                        </div>
                    </div>
                </div>
                <div id="trips-content">
                    <div className='tripPreviewContainer'>
                        <h2>Trips</h2>
                        <div className='tripPreviewBlocksContainer'>
                            {profileInfo.trips.map((trip, index) =>
                                <TripPreview key={index} trip={trip} reloadProfile={fetchProfileInfo}></TripPreview>
                            )}
                        </div>
                    </div>
                    <div className='tripPreviewContainer'>
                        <h2>Pending invitations</h2>
                        <div className='tripPreviewBlocksContainer'>
                            {profileInfo.invitations.map((trip, index) =>
                                <TripInvitation key={index} trip={trip} reloadProfile={fetchProfileInfo}></TripInvitation>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <img id="bottom" src={ondaArancione}/>
        </div>
    );
}

export default ProfilePage;
