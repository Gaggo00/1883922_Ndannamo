import React, { createContext, useState, useContext, useEffect } from 'react';

// Crea il contesto
const AuthContext = createContext();

// Provider
export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Controlla l'autenticazione dal localStorage ogni volta che l'app viene caricata
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token); // Imposta lo stato in base al token
    }, []);

    const login = () => {
        setIsAuthenticated(true);
    };

    const logout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
