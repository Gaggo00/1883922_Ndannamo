import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import '../styles/Navbar.css'

function Navbar() {
    const { isAuthenticated, logout } = useAuth();
    const location = useLocation(); // Ottieni il percorso corrente

    useEffect(() => {
        // Forza un controllo ogni volta che il percorso cambia
        //console.log('Percorso cambiato:', location.pathname);
    }, [location]);

    const handleLogout = () => {
        const confirmDelete = window.confirm('Are you sure you want to logout this user?');
        if (confirmDelete) {
            logout();
        }
    };

    return (
        <div className="navbar">
            <div className="logo">
                <span id="title">NDANNAMO</span>
                <span id="subtitle">WHERE ARE WE GOING</span>
            </div>
            <div className="center">
                <a className="centerEl"><Link to="/">Home</Link></a>
                <a className="centerEl">Trip</a>
            </div>
            {!isAuthenticated && location.pathname !== '/logout' && (<a className="right"><Link to="/login">Login</Link></a>)}
            {isAuthenticated && location.pathname !== '/login' && (<a className="right"><Link to="/" onClick={handleLogout}>Logout</Link></a>)}
        </div>

    );
}

export default Navbar;
