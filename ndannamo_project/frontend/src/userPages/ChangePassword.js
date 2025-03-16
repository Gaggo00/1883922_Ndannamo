import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserService from '../services/AuthService';
import '../styles/Login.css'
import locker from "../static/locker.png";

function ChangePassword() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
          e.preventDefault();
        try {
            const token = localStorage.getItem('token'); // Retrieve the token from localStorage
            if (!token) {
                navigate("/login");  // Redirect the user to the login page
                return;
            }

            const response = await UserService.changePassword(token, currentPassword, newPassword);

            if (response) {
                navigate("/profile");
            } else {

                setError("Passwords not valid");
                console.error('Invalid response data');
            }
        } catch (error) {
            if (error.response) {
                setError("Passwords not valid");
            } else {
                setError('An unexpected error occurred.');
            }
            console.error('Error fetching profile information:', error);
        }
    };

    return (
        <div className="all-page">
            <div className="log-container">
                <div className="login-box">
                    <div className="image-box">
                        <img src={locker} alt="Locker photo" />
                    </div>
                    <div className="form-box">
                        <p id="title">Change password</p>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="password"
                                placeholder="Current password"
                                autoComplete="Current-password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                            />
                            <input
                                type="password"
                                placeholder="New password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <button type="submit">Change password</button>
                            {error && <p className="error-message">{error}</p>}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChangePassword;
