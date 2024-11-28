import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import UserService from '../services/UserService';

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
        <div className="auth-container">
            <h2>Sign up</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Email: </label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Password: </label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type="submit">Sign up</button>
            </form>
        </div>
    );
}

export default Register;
