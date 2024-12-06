import React, {useEffect} from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import '../styles/Navbar.css'
import 'bootstrap-icons/font/bootstrap-icons.css';
import {Dropdown} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';


function Navbar() {
    const { isAuthenticated, logout } = useAuth();
    const location = useLocation(); // Ottieni il percorso corrente

    useEffect(() => {
        // Forza un controllo ogni volta che il percorso cambia
        //console.log('Percorso cambiato:', location.pathname);
    }, [location]);

    const handleLogout = () => {
        logout();
    }


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
            {isAuthenticated && (
                <Dropdown drop="down">
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                        <i className="bi bi-person-circle"></i>
                    </Dropdown.Toggle>

                    {/* Usa la classe CSS personalizzata per il menu */}
                    <Dropdown.Menu className="dropdown-menu-custom">
                        <Dropdown.Item> <Link to="/profile">My profile</Link> </Dropdown.Item>
                        <Dropdown.Item><Link to="/" onClick={handleLogout}>Logout</Link></Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            )}
            {!isAuthenticated && location.pathname !== '/logout' && (<a className="right"><Link to="/login">Login</Link></a>)}
            </div>

                );
            }

export default Navbar;
