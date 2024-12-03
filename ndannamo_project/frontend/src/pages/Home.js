import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import "../styles/Home.css"
import logo from "../static/Logo app.png"
import {useAuth} from "../auth/AuthContext";

function Home() {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const goToLogin = () => {
        if (isAuthenticated) {
            navigate('/');
        }
        else {
            navigate('/login');
        }
    };

    return (
        <div className='home'>
            <img src={logo} alt='App logo' />
            <div className='scritte'>
                <p> PLAN</p>
                <p> SHARE</p>
                <p> AND RELIVE</p>
                <p id="piccolo">YOUR ADVENTURES</p>
                <button onClick={goToLogin}>START NOW</button>
            </div>
        </div>
    );
}

export default Home;
