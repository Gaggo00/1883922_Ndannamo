import React, { useState, useEffect } from 'react';
import UserService from '../services/UserService';
import "../styles/ProfilePage.css"

function ProfilePage() {
    const [profileInfo, setProfileInfo] = useState({});

    useEffect(() => {
        fetchProfileInfo();
    }, []);

    const fetchProfileInfo = async () => {
        try {

            const token = localStorage.getItem('token'); // Retrieve the token from localStorage
            const response = await UserService.getYourProfile(token);
            setProfileInfo(response);
        } catch (error) {
            console.error('Error fetching profile information:', error);
        }
    };

    return (
        <div className="profile-page-container">
            <h2>Profile Information</h2>
            <div id="profile-content">
            <p>Email: {profileInfo.email}</p>
            <div id="pass">
                <p>Password</p>
                <button onClick={fetchProfileInfo}>Change password</button>
            </div>
            <p>Trips: {Array.isArray(profileInfo.trips) ? profileInfo.trips.length : 0}</p>
            </div>
        </div>
    );
}

export default ProfilePage;
