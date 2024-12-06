import React, { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import UserService from '../services/UserService';
import "../styles/Login.css";
import logo from '../static/Logo app.png';

function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth(); // Usa il contesto per aggiornare lo stato di autenticazione
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const userData = await UserService.register(email, password);
            if (userData) {
                localStorage.setItem('token', userData);
                login(); // Aggiorna lo stato di autenticazione (login fatto in automatico quando ti registri)
                navigate('/');
            } else {
                setError(userData.message);
            }
        } catch (error) {
            setError(error.response.data);
            setTimeout(() => {
                setError('');
            }, 5000);
        }
    };

    return (
        <div className="all-page">
            <div className="log-container">
                <div className="login-box">
                    <div className="image-box">
                        <img src={logo} alt='App logo'/>
                    </div>
                    <div className="form-box">
                        <p id="title">Sign up</p>
                        <form onSubmit={handleSubmit}>
                            <input type="email" placeholder="Email" value={email}
                                   onChange={(e) => setEmail(e.target.value)}/>
                            <input type="password" placeholder="Password" value={password}
                                   onChange={(e) => setPassword(e.target.value)}/>
                            <button type="submit">Sign up</button>
                            {error && <p className="error-message">{error}</p>}
                        </form>
                    </div>
                </div>
            </div>
        </div>
)
    ;
}

export default Register;
