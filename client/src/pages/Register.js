import React, { useState } from 'react';
import api from '../services/api.js';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Forzamos el roleId a 3 porque es un registro de cliente público
            await api.post('/auth/register', { email, password, roleId: 3 });

            alert("Compte créé avec succès ! Connectez-vous.");
            navigate('/login');
        } catch (error) {
            console.error("Erreur d'inscription:", error);
            alert("Erreur: " + (error.response?.data?.message || "Impossible de créer le compte"));
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '100px' }}>
            <h2>GearStack - Créer un compte</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '300px' }}>
                <input
                    type="email" placeholder="Email"
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    style={{ marginBottom: '10px', padding: '8px' }} required
                />
                <input
                    type="password" placeholder="Mot de passe"
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    style={{ marginBottom: '10px', padding: '8px' }} required
                />
                <button type="submit" style={{ padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}>
                    S'inscrire
                </button>
            </form>

            {/* ENLACE AL LOGIN */}
            <p style={{ marginTop: '15px' }}>
                ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
            </p>
        </div>
    );
};

export default Register;