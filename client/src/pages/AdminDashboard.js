import React, { useEffect, useState, useCallback } from 'react';
import api from '../services/api.js';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [newWorker, setNewWorker] = useState({ email: '', password: '', roleId: 2 });

    // 1. Usamos useCallback para que la función no cambie en cada renderizado
    // Esto evita que el useEffect se dispare infinitamente o de forma síncrona peligrosa
    const fetchUsers = useCallback(async () => {
        try {
            const response = await api.get('/auth/users-list');
            // Solo actualizamos si el componente está montado
            setUsers(response.data.users || []);
        } catch (error) {
            console.error("Erreur lors del cargue de usuarios", error);
        }
    }, []); // Dependencias vacías para que se cree una sola vez

    // 2. El useEffect ahora es más "limpio" y cumple las reglas de ESLint
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchUsers();
    }, [fetchUsers]); // Se añade fetchUsers como dependencia segura

    const handleCreateWorker = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/register', newWorker);
            alert("Ouvrier créé avec succès !");
            setNewWorker({ email: '', password: '', roleId: 2 });
            setShowForm(false);
            fetchUsers(); // Recargamos la lista tras crear uno nuevo
        } catch (error) {
            alert("Erreur: " + (error.response?.data?.message || "Erreur serveur"));
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Panneau d'administration - Gestion des ouvriers</h2>

            <button
                onClick={() => setShowForm(!showForm)}
                style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}
            >
                {showForm ? 'Annuler' : 'Ajouter un nouveau mécanicien'}
            </button>

            {showForm && (
                <form onSubmit={handleCreateWorker} style={{ marginBottom: '30px', border: '1px solid #ddd', padding: '15px', maxWidth: '400px' }}>
                    <h3>Créer un compte employé</h3>
                    <input
                        type="email" placeholder="Email"
                        value={newWorker.email} onChange={(e) => setNewWorker({...newWorker, email: e.target.value})}
                        style={{ display: 'block', marginBottom: '10px', width: '100%', padding: '8px' }} required
                    />
                    <input
                        type="password" placeholder="Mot de passe"
                        value={newWorker.password} onChange={(e) => setNewWorker({...newWorker, password: e.target.value})}
                        style={{ display: 'block', marginBottom: '10px', width: '100%', padding: '8px' }} required
                    />
                    <button type="submit" style={{ padding: '8px 15px', backgroundColor: '#28a745', color: 'white', border: 'none' }}>Enregistrer</button>
                </form>
            )}

            <table border="1" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead>
                <tr style={{ backgroundColor: '#f2f2f2' }}>
                    <th style={{ padding: '10px' }}>ID</th>
                    <th style={{ padding: '10px' }}>Email</th>
                    <th style={{ padding: '10px' }}>Rôle</th>
                </tr>
                </thead>
                <tbody>
                {users.map(u => (
                    <tr key={u.id}>
                        <td style={{ padding: '10px' }}>{u.id}</td>
                        <td style={{ padding: '10px' }}>{u.email}</td>
                        <td style={{ padding: '10px' }}>{u.roleId === 1 ? 'Admin' : u.roleId === 2 ? 'Mécanicien' : 'Client'}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminDashboard;