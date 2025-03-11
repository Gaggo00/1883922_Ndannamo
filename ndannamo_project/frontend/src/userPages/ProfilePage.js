import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import UserService from '../services/UserService';
import ConfirmDelete from '../common/ConfirmDelete.js';
import TripInvitation from '../components/TripInvitation.js'

import passport from '../static/Passport.png';
import "./ProfilePage.css";
import "../styles/TripPreview.css";


function ProfilePage() {
    // Impostiamo un valore di default per profileInfo
    const [profileInfo, setProfileInfo] = useState({
        nickname: '',
        email: '',
        trips: [],
        invitations : []
    });

    // Per il pop up di conferma eliminazione profilo
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleOverlayClick = (e) => {
        // Verifica se l'utente ha cliccato sull'overlay e non sul contenuto del modal
        if (e.target.className === "modal-overlay") {
            setIsModalOpen(false);
        }
    };


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
        navigate('/trips');
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
        if (profileInfo.nickname === newNickname) {
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


    // Funzione per eliminare il profilo, ancora da fare
    const deleteProfile = () => {
        console.log("profile deleted");
        setIsModalOpen(false);
    }




    return (
        <div className="page profile-page">
            <div className="profile-page-container">
                {/*<h2>Profile Information</h2>*/}
                <div id="profile-content-outside" className='flex-column align-items-center'>
                    <div id="profile-content" className='flex-column'>
                        <div className="header-section" id="section1">
                            <div className="icon-label">
                                <h3>Your information</h3>
                            </div>
                        </div>
                        <div className='flex-row'>
                            <div id="image-box">
                                <img src={passport} alt="User's passport photo" />
                            </div>
                            <div id="info">
                                <h2>Hi, {profileInfo.nickname}</h2>
                                <div id="info-campi">
                                    <p className='flex-row'><strong>Username:&nbsp;</strong>
                                        {!editingNickname ? (
                                            <span className='flex-row'>
                                                {profileInfo.nickname}
                                                <button onClick={makeNicknameEditable} className='edit-button'><i className="bi bi-pencil-fill"/></button>
                                            </span>
                                        ) : (
                                            <span className='flex-row'>
                                                <input type="text"
                                                    id="nickname-input"
                                                    value={newNickname}
                                                    onChange={handleInputChange}
                                                    onKeyDown={handleKeyDown}/>
                                                <button onClick={saveNewNickname} className='edit-button'><i className="bi bi-floppy-fill"/></button>
                                            </span>
                                        )}
                                    </p>
                                    <p>
                                        <strong>Email: </strong>
                                        {profileInfo.email}
                                    </p>
                                    <p>
                                        <strong>Password: </strong>*******
                                        <button className="edit-button" onClick={handlePasswordChange}><i className="bi bi-pencil-fill"/></button>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button id="goToTripsButton" onClick={goToTrips}><h3>See your trips</h3></button>
                </div>              
                <div id="invitations-content" className='flex-column'>
                    <div className="header-section" id="section3">
                        <div className="icon-label">
                            <h3>Invitations</h3>
                        </div>
                    </div>
                    <div className='invitationsContainer flex-column'>
                        {(profileInfo.invitations.length < 1) ? (
                            <div id="noInvitationsText">You don't have any invitations.</div>
                        ) : (
                            <div>
                            {profileInfo.invitations.map((trip, index) =>
                                <TripInvitation key={index} trip={trip} reloadProfile={fetchProfileInfo}></TripInvitation>
                            )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <button id="deleteProfileButton" onClick={() => {setIsModalOpen(true)}}>Delete profile</button>
            {isModalOpen && (
                <div className="modal-overlay" onClick={handleOverlayClick}>
                    <div className="trip-box">
                        <ConfirmDelete
                            message={"Do you really want to delete your profile?\nThis operation can't be reversed!"}
                            onConfirm={deleteProfile}
                            onClose={()=>{setIsModalOpen(false);}}/>
                    </div>
                </div>
            )} 
        </div>
    );
}

export default ProfilePage;
