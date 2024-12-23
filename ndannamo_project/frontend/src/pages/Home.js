import React from 'react';
import {useNavigate} from 'react-router-dom';
import "../styles/Home.css"
import logo from "../static/Logo app.png"
import {useAuth} from "../auth/AuthContext";

import ondaVerde from "../static/svg/onda_sopra_verde.svg"
import ondaArancione from "../static/svg/onda_sotto_arancione.svg"

function Home() {
    const {isAuthenticated, logout} = useAuth();
    const navigate = useNavigate();

    const goToLogin = () => {
        if (isAuthenticated) {
            navigate('/main');
        } else {
            navigate('/login');
        }
    };

    return (
        <div className="page">
            <img id="top" src={ondaVerde}/>
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
            <img id="bottom" src={ondaArancione}/>
        </div>

    )
        ;
}

export default Home;
