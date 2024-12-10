import React, { useState, useEffect } from 'react';
import UserService from '../services/UserService';
import TripPreview from '../components/TripPreview.js'
import TripInvitation from '../components/TripInvitation.js'
import passport from '../static/Passport.png';
import { useNavigate } from 'react-router-dom';

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
            <div id="color"></div>
            <div className="profile-page-container">
                <h2>Profile Information</h2>
                <div id="profile-content">
                    <div id="image-box">
                        <img src={passport} alt="User's passport photo" />
                    </div>
                    <div id="scritte">
                        <p><strong>Username:</strong> {profileInfo.nickname}</p>
                        <p><strong>Email:</strong> {profileInfo.email}</p>
                        <div id="pass">
                            <p><strong>Password:</strong></p>
                            <button onClick={handlePasswordChange}>Change password</button>
                        </div>
                        <div><strong>Trips:</strong></div>
                        <div className='tripPreviewContainer'>
                            {profileInfo.trips.map((trip, index) =>
                                <TripPreview key={index} trip={trip}></TripPreview>
                            )}
                        </div>
                        <div><strong>Pending invitations:</strong></div>
                        <div className='tripPreviewContainer'>
                            {profileInfo.invitations.map((trip, index) =>
                                <TripInvitation key={index} trip={trip} reloadProfile={fetchProfileInfo}></TripInvitation>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div id="orange"></div>
        </div>
    );
}

export default ProfilePage;
