import React, { useState, useEffect } from 'react';
import UserService from '../services/UserService';
import TripPreview from '../components/TripPreview.js'
import TripInvitation from '../components/TripInvitation.js'
import passport from '../static/Passport.png';
import { useNavigate } from 'react-router-dom';

import ondaVerde from "../static/svg/onda_sopra_verde.svg"
import ondaArancione from "../static/svg/onda_sotto_arancione.svg"

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
    const [editingNickname, setEditingNickname] = useState(false);
    const [newNickname, setNewNickname] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        fetchProfileInfo();
    }, []);

    const handlePasswordChange = () => {
        navigate('/change-password');
    };

    const goToTrips = () => {
        navigate('/main');
    }

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
                setNewNickname(response.nickname);
            } else {
                console.error('Invalid response data');
            }
        } catch (error) {
            console.error('Error fetching profile information:', error);
        }
    };

    const makeNicknameEditable = () => {
        setEditingNickname(true);
    }
    const saveNewNickname = () => {
        // se il nickname non e' cambiato, non fare nulla
        if (profileInfo.nickname == newNickname) {
            setEditingNickname(false);
            return;
        }

        // manda richiesta al server
        const token = localStorage.getItem('token'); // Recuperiamo il token da localStorage
        if (!token) {
            navigate("/login");
        }

        // Chiamata al servizio per ottenere le informazioni del profilo
        UserService.changeNickname(token, newNickname);

        // aggiorna in locale
        profileInfo.nickname = newNickname;
        setEditingNickname(false);
    }

    // Per quando scrivi qualcosa nel campo per modificare il nickname
    const handleInputChange = (event) => {
        var input = event.target.value.replaceAll(" ", "");
        input = input.substring(0, 20);     // MAX 20 CARATTERI?
        setNewNickname(input);
    }

    // Per quando stai modificando il nickname e premi invio
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (newNickname.trim()) {
                saveNewNickname();
            }
        }
    };

    return (
        <div className="page profile-page">
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
                        <p><strong>Username: </strong>
                            <span>
                                {!editingNickname && profileInfo.nickname}
                                {!editingNickname && <button onClick={makeNicknameEditable} className='nickname-button'><i className="bi bi-pencil-fill"></i></button>}
                                {editingNickname && <input type="text"
                                                            id="nickname-input"
                                                            value={newNickname}
                                                            onChange={handleInputChange}
                                                            onKeyDown={handleKeyDown}/>}
                                {editingNickname && <button onClick={saveNewNickname} className='nickname-button'><i className="bi bi-floppy-fill"></i></button>}
                                
                            </span>
                        </p>
                        <p>
                            <strong>Email: </strong>
                            {profileInfo.email}
                        </p>
                        <div id="pass">
                            <p><strong>Password: </strong></p>
                            <button onClick={handlePasswordChange}>Change password</button>
                        </div>
                    </div>
                </div>
                <div id="trips-content">
                    <div className='tripPreviewContainer'>
                        <h2>Trips</h2>
                        <div className='flex-space-between'>
                            <div className='tripPreviewBlocksContainer'>
                                {profileInfo.trips.slice(0, 3).map((trip, index) =>
                                    <TripPreview key={index} trip={trip} reloadProfile={profileInfo}></TripPreview>
                                )}
                            </div>
                            <button id="all-trips-button" onClick={goToTrips}>
                                <i className="bi bi-chevron-double-right h2"></i>
                                <p>All trips</p>
                            </button>
                        </div> 
                    </div>
                    <div className='tripPreviewContainer invitationsContainer'>
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
