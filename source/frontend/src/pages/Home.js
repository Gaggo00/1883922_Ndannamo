import React from 'react';
import {useNavigate} from 'react-router-dom';
import "../styles/Home.css"
import logo from "../static/Logo app.png"
import {useAuth} from "../auth/AuthContext";

import ondaVerde from "../static/svg/onda_sopra_verde.svg"
import ondaArancione from "../static/svg/onda_sotto_arancione.svg"


export default function Home() {
    const {isAuthenticated, logout} = useAuth();
    const navigate = useNavigate();

    const goToLogin = () => {
        if (isAuthenticated) {
            navigate('/trips');
        } else {
            navigate('/login');
        }
    };


    // Controlla se il token e' scaduto e in caso eliminalo
    if (isAuthenticated) {
        const expiration = localStorage.getItem('token-expiration');

        // Se non c'e' la data di scadenza, fai il logout
        if (!expiration) {
            logout();
        }
        else {
            var expirationDate = Date.parse(expiration);

            // Se expirationDate e' minore di "now", significa che e' gia' passata, quindi il token e' scaduto
            if (expirationDate < Date.now()) {
                // Fai il logout (che rimuove automaticamente il token)
                logout();
            }
        }
    }


    return (
        <div className="page">
            <img id="top" src={ondaVerde} alt="green-wave"/>
            <div className='home'>
                <img id="logo" src={logo} alt='App logo'/>
                <div className='scritte'>
                    <p> PLAN</p>
                    <p> SHARE</p>
                    <p> AND RELIVE</p>
                    <p id="piccolo">YOUR ADVENTURES</p>

                    <button onClick={goToLogin}>START NOW</button>
                </div>
            </div>
            <img id="bottom" src={ondaArancione} alt="orange-wave"/>
        </div>

    );
}
