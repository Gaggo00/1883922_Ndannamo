import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

function Navbar() {
    const { isAuthenticated, logout } = useAuth();
    const location = useLocation(); // Ottieni il percorso corrente

    useEffect(() => {
        // Forza un controllo ogni volta che il percorso cambia
        console.log('Percorso cambiato:', location.pathname);
    }, [location]);

    const handleLogout = () => {
        const confirmDelete = window.confirm('Are you sure you want to logout this user?');
        if (confirmDelete) {
            logout();
        }
    };

    return (
        <nav>
            <ul>
                {isAuthenticated && location.pathname !== '/login' && (<li><Link to="/" onClick={handleLogout}>Logout</Link></li>)}
                {!isAuthenticated && location.pathname !== '/logout' && (<li><Link to="/login">Login</Link></li>)}
                <li><Link to="/">Home</Link></li>
            </ul>
        </nav>
    );
}

export default Navbar;
