import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();

    const goToLogin = () => {
        navigate('/login'); // Reindirizza alla pagina di login
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Benvenuto nel nostro fantastico sito!</h1>
            <p>Questa è la pagina Home. Scopri tutto ciò che abbiamo da offrire!</p>
            <button
                onClick={goToLogin}
                style={{
                    padding: '10px 20px',
                    fontSize: '16px',
                    cursor: 'pointer',
                    backgroundColor: '#007BFF',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                }}
            >
                Vai al Login
            </button>
        </div>
    );
}

export default Home;
