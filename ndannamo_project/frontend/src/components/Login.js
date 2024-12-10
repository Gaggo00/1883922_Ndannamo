import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import AuthService from '../services/AuthService';

import '../styles/Login.css'
import logo from '../static/Logo app.png'
import ondaVerde from "../static/wave/Onda2_Verda.png"
import ondaArancione from "../static/wave/Onda1_Arancione.png"


function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth(); // Usa il contesto per aggiornare lo stato di autenticazione
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const userData = await AuthService.login(email, password);
            if (userData) {
                localStorage.setItem('token', userData);
                login(); // Aggiorna lo stato di autenticazione
                navigate('/');
            } else {
                setError(userData.message);
            }
        } catch (error) {
            //console.log(error);
            setError(error.response.data);
            setTimeout(() => {
                setError('');
            }, 5000);
        }
    };

    return (
        <div className="all-page">
            <img id="top" src={ondaVerde}/>
            <div class="log-container">
                <div class="login-box">
                    <div class="image-box">
                        <img src={logo} alt='App logo'/>
                    </div>
                    <div class="form-box">
                        <p id="title">Login</p>
                        <form onSubmit={handleSubmit}>
                            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                            <input type="password" placeholder="Password" value={password}
                                onChange={(e) => setPassword(e.target.value)}/>
                            <button type="submit">Login</button>
                            {error && <p className="error-message">{error}</p>}
                            <p id="subtitle" >Don't have an account yet? <Link to="/register">Sign up</Link></p>
                        </form>
                    </div>
                </div>
            </div>
            <img id="bottom" src={ondaArancione}/>
        </div>
);
}

export default Login;
