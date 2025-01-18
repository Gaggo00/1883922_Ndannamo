import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import AuthService from '../services/AuthService';

import '../styles/Login.css'
import logo from '../static/Logo app.png'
import ondaVerde from "../static/svg/onda_sopra_verde.svg"
import ondaArancione from "../static/svg/onda_sotto_arancione.svg"


function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth(); // Usa il contesto per aggiornare lo stato di autenticazione
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => {
        if (showPassword) document.getElementById("password-field").type = "password";
        else document.getElementById("password-field").type = "text";
        setShowPassword(!showPassword);
    }


    const setInvalidField = (id) => {
        document.getElementById(id).classList.add("wrong-input");
        /*
        setTimeout(() => {
            setValidField(id);
        }, 1500);
        */
    }
    const setValidField = (id) => {
        document.getElementById(id).classList.remove("wrong-input");
    }


    const handleSubmit = async (e) => {
        e.preventDefault();

        // Controlla se nei campi c'e' scritto qualcosa
        var fieldsOk = true;
        if (email.trim() === "") {
            setInvalidField("email-field");
            fieldsOk = false;
        }
        if (password.trim() === "") {
            setInvalidField("password-field");
            fieldsOk = false;
        }
        if (!fieldsOk) return;

        try {
            const userData = await AuthService.login(email, password);
            if (userData) {
                // userData ha questa forma: "token,expiration"
                var userDataArray = userData.split(",");
                var token = userDataArray[0];
                var expiration = userDataArray[1];
                localStorage.setItem('token', token);
                localStorage.setItem('token-expiration', expiration);
                login(); // Aggiorna lo stato di autenticazione
                navigate('/');
            } else {
                setError("Wrong email or password");
            }
        } catch (error) {
            //console.log(error);
            setError("Wrong email or password");
            /*
            setTimeout(() => {
                setError('');
            }, 5000);*/
        }
    };

    return (
        <div className="all-page">
            <img id="top" src={ondaVerde}/>
            <div className="log-container">
                <div className="login-box">
                    <div className="image-box">
                        <img src={logo} alt='App logo'/>
                    </div>
                    <div className="form-box">
                        <p id="title">Login</p>
                        <form onSubmit={handleSubmit}>
                            <div id="form-fields">
                                <input type="email" id="email-field" placeholder="Email" value={email} onChange={(e) => {setValidField("email-field"); setEmail(e.target.value);}}/>
                                <div id='password-and-eye'>
                                    <input type="password" id="password-field" placeholder="Password" value={password}
                                    onChange={(e) => {setValidField("password-field"); setPassword(e.target.value);}}/>
                                    {!showPassword && <i className="bi bi-eye-fill h5 clickable" onClick={toggleShowPassword}></i>}
                                    {showPassword && <i className="bi bi-eye-slash-fill h5 clickable" onClick={toggleShowPassword}></i>}
                                </div>
                            </div>
                            <button type="submit">Login</button>
                            {error && <p className="error-message">{error}</p>}
                            <p id="subtitle">Don't have an account yet? <Link to="/register">Sign up</Link></p>
                        </form>
                    </div>
                </div>
            </div>
            <img id="bottom" src={ondaArancione}/>
        </div>
);
}

export default Login;
