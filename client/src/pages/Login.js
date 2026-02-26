import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api.js';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/login', { email, password });
            // Verificamos en consola qué está llegando exactamente
            console.log("Données reçues:", response.data);
            const { token, user } = response.data;
            login(token, user);
        } catch (error) {
            console.error("Erreur de connexion:", error.response?.data);
            alert("Identifiants invalides");
        }
    };

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            backgroundColor: '#121212', // Fondo más oscuro y moderno
            color: 'white',
            fontFamily: 'Arial, sans-serif'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '350px',
                padding: '40px',
                backgroundColor: '#1e1e1e', // Tarjeta ligeramente más clara que el fondo
                borderRadius: '8px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
                textAlign: 'center'
            }}>
                <h2 style={{ marginBottom: '30px', color: '#fff' }}>GearStack - Connexion</h2>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
                    <input
                        type="email" placeholder="Email"
                        value={email} onChange={(e) => setEmail(e.target.value)}
                        style={{ marginBottom: '15px', padding: '12px', borderRadius: '4px', border: '1px solid #333', backgroundColor: '#2c2c2c', color: 'white' }}
                        required
                    />
                    <input
                        type="password" placeholder="Mot de passe"
                        value={password} onChange={(e) => setPassword(e.target.value)}
                        style={{ marginBottom: '20px', padding: '12px', borderRadius: '4px', border: '1px solid #333', backgroundColor: '#2c2c2c', color: 'white' }}
                        required
                    />
                    <button type="submit" style={{ padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', transition: '0.3s' }}>
                        Se connecter
                    </button>
                </form>

                <p style={{ marginTop: '25px', fontSize: '14px', color: '#bbb' }}>
                    ¿No tienes cuenta? <Link to="/register" style={{ color: '#007bff', textDecoration: 'none', fontWeight: 'bold' }}>Regístrate aquí</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;