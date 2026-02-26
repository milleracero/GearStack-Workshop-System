import React, { useEffect, useState, useCallback, useContext } from 'react';
import api from '../services/api.js';
import { AuthContext } from '../context/AuthContext';

const ClientDashboard = () => {
    const { user } = useContext(AuthContext);
    const [vehicles, setVehicles] = useState([]);
    const [selectedCar, setSelectedCar] = useState(null);
    const [repairs, setRepairs] = useState([]);

    // Estados para el nuevo formulario de registro
    const [showAddForm, setShowAddForm] = useState(false);
    const [newCar, setNewCar] = useState({ plate: '', brand: '', model: '' });

    const fetchMyVehicles = useCallback(async () => {
        if (!user || !user.id) return;

        try {
            const response = await api.get(`/cars/owner/${user.id}`);
            setVehicles(response.data || []);
        } catch (error) {
            console.error("Erreur lors du chargement des véhicules:", error);
        }
    }, [user]);

    const fetchRepairs = async (carId) => {
        try {
            const response = await api.get(`/repairs/car/${carId}`);
            setRepairs(response.data || []);
            setSelectedCar(vehicles.find(v => v.id === carId));
        } catch (error) {
            console.error("Erreur lors du chargement des réparations:", error);
        }
    };

    // Función para manejar el registro de un nuevo vehículo
    const handleAddCar = async (e) => {
        e.preventDefault();
        try {
            // Enviamos solo los datos del carro. El backend asignará el ownerId por seguridad.
            await api.post('/cars', newCar);
            alert("Véhicule enregistré avec succès !");
            setNewCar({ plate: '', brand: '', model: '' });
            setShowAddForm(false);
            fetchMyVehicles(); // Recargar la lista automáticamente
        } catch (error) {
            console.error("Erreur:", error.response?.data);
            alert(error.response?.data?.message || "Erreur lors de l'enregistrement");
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchMyVehicles();
    }, [fetchMyVehicles]);

    return (
        <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'Arial' }}>
            <h2 style={{ borderBottom: '2px solid #007bff', paddingBottom: '10px', color: '#ffffff' }}>
                Mon Garage Virtuel
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginTop: '20px' }}>

                {/* --- SECCIÓN: MES VÉHICULES --- */}
                <section>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                        <h3 style={{ color: '#ffffff', margin: 0 }}>Mes Véhicules</h3>
                        <button
                            onClick={() => setShowAddForm(!showAddForm)}
                            style={{
                                padding: '8px 15px',
                                backgroundColor: showAddForm ? '#dc3545' : '#28a745',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            {showAddForm ? 'Annuler' : '+ Ajouter'}
                        </button>
                    </div>

                    {/* Formulario de registro rápido */}
                    {showAddForm && (
                        <div style={{
                            backgroundColor: '#ffffff',
                            padding: '20px',
                            borderRadius: '8px',
                            marginBottom: '20px',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        }}>
                            <h4 style={{ color: '#333', marginTop: 0 }}>Enregistrer un véhicule</h4>
                            <form onSubmit={handleAddCar}>
                                <input
                                    type="text" placeholder="Plaque (ex: ABC-123)" required
                                    value={newCar.plate} onChange={(e) => setNewCar({...newCar, plate: e.target.value})}
                                    style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                                />
                                <input
                                    type="text" placeholder="Marque (ex: Toyota)" required
                                    value={newCar.brand} onChange={(e) => setNewCar({...newCar, brand: e.target.value})}
                                    style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                                />
                                <input
                                    type="text" placeholder="Modèle (ex: Corolla)" required
                                    value={newCar.model} onChange={(e) => setNewCar({...newCar, model: e.target.value})}
                                    style={{ width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                                />
                                <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                                    Confirmer l'ajout
                                </button>
                            </form>
                        </div>
                    )}

                    {vehicles.length === 0 ? (
                        <p style={{ color: '#ccc' }}>Aucun véhicule enregistré à votre nom.</p>
                    ) : (
                        vehicles.map(v => (
                            <div
                                key={v.id}
                                onClick={() => fetchRepairs(v.id)}
                                style={{
                                    padding: '15px',
                                    marginBottom: '10px',
                                    backgroundColor: selectedCar?.id === v.id ? '#e7f3ff' : '#ffffff',
                                    border: selectedCar?.id === v.id ? '2px solid #007bff' : '1px solid #ddd',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    transition: '0.3s',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                }}
                            >
                                <strong style={{ fontSize: '1.1em', color: '#000000', display: 'block' }}>
                                    {v.brand} {v.model}
                                </strong>
                                <p style={{ margin: '5px 0 0', color: '#333333' }}>
                                    <strong style={{ color: '#000000' }}>Plaque:</strong> {v.plate}
                                </p>
                            </div>
                        ))
                    )}
                </section>

                {/* --- SECCIÓN: HISTORIAL DE REPARACIONES --- */}
                <section>
                    <h3 style={{ color: '#ffffff' }}>Historique des Réparations</h3>
                    {!selectedCar ? (
                        <div style={{
                            padding: '20px',
                            backgroundColor: 'rgba(255,255,255,0.05)',
                            borderRadius: '8px',
                            textAlign: 'center',
                            border: '1px dashed #666'
                        }}>
                            <p style={{ fontStyle: 'italic', color: '#aaa' }}>
                                Sélectionnez un véhicule pour voir son historique.
                            </p>
                        </div>
                    ) : (
                        <div style={{
                            padding: '15px',
                            border: '1px solid #28a745',
                            borderRadius: '8px',
                            backgroundColor: '#ffffff',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}>
                            <h4 style={{ marginTop: 0, color: '#28a745', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>
                                {selectedCar.brand} — {selectedCar.plate}
                            </h4>
                            {repairs.length === 0 ? (
                                <p style={{ color: '#333333' }}>Aucune réparation enregistrée pour ce vehículo.</p>
                            ) : (
                                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                                    <thead>
                                    <tr style={{ textAlign: 'left', borderBottom: '2px solid #eee', color: '#555555' }}>
                                        <th style={{ padding: '10px' }}>Description</th>
                                        <th style={{ padding: '10px' }}>Statut</th>
                                        <th style={{ padding: '10px' }}>Coût</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {repairs.map(r => (
                                        <tr key={r.id} style={{ borderBottom: '1px solid #f1f1f1' }}>
                                            <td style={{ padding: '10px', fontSize: '0.95em', color: '#333333' }}>
                                                {r.description}
                                            </td>
                                            <td style={{ padding: '10px' }}>
                                                    <span style={{
                                                        padding: '4px 10px',
                                                        borderRadius: '12px',
                                                        fontSize: '0.8em',
                                                        fontWeight: 'bold',
                                                        backgroundColor: r.status === 'Terminé' ? '#d4edda' : '#fff3cd',
                                                        color: r.status === 'Terminé' ? '#155724' : '#856404'
                                                    }}>
                                                        {r.status || 'En cours'}
                                                    </span>
                                            </td>
                                            <td style={{ padding: '10px', fontWeight: 'bold', color: '#000000' }}>
                                                {parseFloat(r.cost).toFixed(2)} €
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default ClientDashboard;