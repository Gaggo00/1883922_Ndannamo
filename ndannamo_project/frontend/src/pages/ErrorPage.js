import React from 'react';
import {useNavigate} from 'react-router-dom';
import "../styles/Home.css"
import {useAuth} from "../auth/AuthContext";

export default function ErrorPage() {
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
        <div className="error-page">
            <div className="error-center">
                <div className='scritte'>
                    <p> SOMETHING</p>
                    <p> WENT WRONG</p>
                    <button onClick={goToLogin}>GO BACK TO HOME</button>
                </div>
            </div>
            <div className="arancione">
            </div>
        </div>

    );
}
