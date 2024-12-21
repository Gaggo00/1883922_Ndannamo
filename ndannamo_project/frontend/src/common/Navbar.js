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
                <div id="valigia-logo"></div>
                <div id="scritta-logo"></div>
            </div>
            <div className="center">
                <Link to="/" className="centerEl">Home</Link>
                <Link to="/main" className="centerEl">Trip</Link>
            </div>
            {isAuthenticated && (
                <Dropdown drop="down">
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                        <i className="bi bi-passport"></i>
                    </Dropdown.Toggle>

                    {/* Usa la classe CSS personalizzata per il menu */}
                    <Dropdown.Menu className="dropdown-menu-custom">
                        <Dropdown.Item> <Link to="/profile">My profile</Link> </Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item><Link to="/" onClick={handleLogout}>Logout</Link></Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            )}
            {!isAuthenticated && location.pathname !== '/logout' && (<Link to="/login" className="nav-right">Login</Link>)}
            </div>

                );
            }

export default Navbar;
