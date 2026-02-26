import React, { useEffect, useState, useCallback, useContext } from 'react';
import api from '../services/api.js';
import { AuthContext } from '../context/AuthContext';

const ClientDashboard = () => {
    const { user } = useContext(AuthContext);
    const [vehicles, setVehicles] = useState([]);
    const [selectedCar, setSelectedCar] = useState(null);
    const [repairs, setRepairs] = useState([]);

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
                    <h3 style={{ color: '#ffffff' }}>Mes Véhicules</h3>
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
                                {/* TEXTO EN NEGRO PARA EL MODELO */}
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
                                <p style={{ color: '#333333' }}>Aucune réparation enregistrée pour ce véhicule.</p>
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
                                            {/* TEXTO EN GRIS OSCURO PARA LA DESCRIPCIÓN */}
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