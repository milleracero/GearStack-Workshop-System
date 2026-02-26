import React, { useState, useEffect, useCallback, useContext } from 'react';
import api from '../services/api.js';
import { AuthContext } from '../context/AuthContext';

const MechanicDashboard = () => {
    const { user } = useContext(AuthContext);
    const [plate, setPlate] = useState('');
    const [car, setCar] = useState(null);
    const [showCarForm, setShowCarForm] = useState(false);
    const [newCar, setNewCar] = useState({ brand: '', model: '', ownerId: '' });
    const [repair, setRepair] = useState({ description: '', cost: '', status: 'En cours' });
    const [interventions, setInterventions] = useState([]);

    // Función para obtener todas las intervenciones
    const fetchInterventions = useCallback(async () => {
        try {
            const response = await api.get('/cars/interventions');
            setInterventions(response.data || []);
        } catch (error) {
            console.error("Erreur interventions:", error);
            setInterventions([]);
        }
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchInterventions();
    }, [fetchInterventions]);

    // NUEVA FUNCIÓN: Actualizar el estado de una reparación desde la tabla
    const handleUpdateStatus = async (repairId, currentStatus) => {
        const newStatus = currentStatus === 'En cours' ? 'Terminé' : 'En cours';
        try {
            // Se asume que la ruta en el backend es PUT /api/repairs/:id/status
            await api.put(`/repairs/${repairId}/status`, { status: newStatus });
            fetchInterventions(); // Refrescar la tabla para mostrar el cambio
        } catch (error) {
            console.error("Erreur lors de la mise à jour du statut:", error);
            alert("Erreur lors del cambio de estado");
        }
    };

    const handleSearch = async () => {
        const cleanPlate = plate.trim().toUpperCase();
        if (!cleanPlate) return;

        try {
            const response = await api.get(`/cars/plate/${cleanPlate}`);
            setCar(response.data);
            setShowCarForm(false);
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setCar(null);
                setShowCarForm(true);
            } else {
                console.error("Détails de l'erreur:", error.response?.data);
                alert("Erreur lors de la recherche sur le serveur");
            }
        }
    };

    const handleCreateCar = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/cars', {
                plate: plate.trim().toUpperCase(),
                ...newCar
            });
            setCar(response.data.car);
            setShowCarForm(false);
            alert("Véhicule enregistré !");
            fetchInterventions();
            // eslint-disable-next-line no-unused-vars
        } catch (error) {
            alert("Erreur lors de l'enregistrement. Vérifiez l'ID du client.");
        }
    };

    const handleCreateRepair = async (e) => {
        e.preventDefault();
        try {
            await api.post('/repairs', {
                carId: car.id,
                description: repair.description,
                cost: repair.cost,
                status: repair.status,
                mechanicId: user.id
            });
            alert("Réparation ajoutée avec succès !");
            setRepair({ description: '', cost: '', status: 'En cours' });
            setCar(null);
            setPlate('');
            fetchInterventions();
        } catch (error) {
            console.error("Erreur:", error.response);
            alert("Erreur de route ou de serveur");
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'Arial' }}>
            <h2 style={{ borderBottom: '2px solid #333', paddingBottom: '10px' }}>
                Atelier GearStack - Panneau Mécanicien
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: (car || showCarForm) ? '1fr 1fr' : '1fr', gap: '20px' }}>
                {/* Sección de Búsqueda */}
                <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                    <h3>Chercher un véhicule</h3>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input
                            type="text" placeholder="Plaque (ex: GEAR-2026)"
                            value={plate} onChange={(e) => setPlate(e.target.value)}
                            style={{ padding: '10px', flex: 1 }}
                        />
                        <button onClick={handleSearch} style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>
                            Chercher
                        </button>
                    </div>
                </div>

                {/* Formulario Nuevo Vehículo */}
                {showCarForm && (
                    <div style={{ padding: '20px', backgroundColor: '#fff3cd', borderRadius: '8px' }}>
                        <h3>Enregistrer {plate}</h3>
                        <form onSubmit={handleCreateCar}>
                            <input type="text" placeholder="Marque" onChange={(e) => setNewCar({...newCar, brand: e.target.value})} required style={{ width: '95%', marginBottom: '10px', padding: '8px' }} />
                            <input type="text" placeholder="Modèle" onChange={(e) => setNewCar({...newCar, model: e.target.value})} required style={{ width: '95%', marginBottom: '10px', padding: '8px' }} />
                            <input type="number" placeholder="ID Client" onChange={(e) => setNewCar({...newCar, ownerId: e.target.value})} required style={{ width: '95%', marginBottom: '10px', padding: '8px' }} />
                            <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#856404', color: 'white', border: 'none' }}>Créer Véhicule</button>
                        </form>
                    </div>
                )}

                {/* Formulario Nueva Reparación */}
                {car && (
                    <div style={{ padding: '20px', border: '2px solid #28a745', borderRadius: '8px', backgroundColor: '#f0fff4' }}>
                        <h3 style={{ color: '#218838', margin: 0 }}>Travail sur: {car.plate}</h3>
                        <form onSubmit={handleCreateRepair} style={{ marginTop: '10px' }}>
                            <textarea
                                placeholder="Notes techniques..."
                                value={repair.description} onChange={(e) => setRepair({...repair, description: e.target.value})}
                                style={{ width: '100%', height: '60px', marginBottom: '10px', padding: '8px' }} required
                            />
                            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                <input type="number" placeholder="Prix" value={repair.cost} onChange={(e) => setRepair({...repair, cost: e.target.value})} style={{ padding: '8px', flex: 1 }} required />
                                <select value={repair.status} onChange={(e) => setRepair({...repair, status: e.target.value})} style={{ padding: '8px', flex: 1 }}>
                                    <option value="En cours">En cours</option>
                                    <option value="Terminé">Terminé</option>
                                </select>
                            </div>
                            <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}>Enregistrer</button>
                        </form>
                    </div>
                )}
            </div>

            {/* Tabla de Intervenciones */}
            <div style={{ marginTop: '40px' }}>
                <h3 style={{ color: '#333' }}>Mes dernières interventions</h3>
                <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    backgroundColor: 'white',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                    color: '#333'
                }}>
                    <thead>
                    <tr style={{ backgroundColor: '#2c3e50', textAlign: 'left' }}>
                        <th style={{ padding: '12px', color: 'white' }}>Plaque</th>
                        <th style={{ padding: '12px', color: 'white' }}>Modèle</th>
                        <th style={{ padding: '12px', color: 'white' }}>Statut</th>
                        <th style={{ padding: '12px', color: 'white' }}>Note</th>
                    </tr>
                    </thead>
                    <tbody>
                    {interventions.flatMap(carItem =>
                        (carItem.repairs || []).map(repairItem => ({
                            ...repairItem,
                            plate: carItem.plate,
                            brand: carItem.brand,
                            model: carItem.model,
                            carId: carItem.id
                        }))
                    ).map((item, index) => (
                        <tr key={`${item.id || index}`} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '12px' }}>
                                <strong style={{ color: '#007bff' }}>{item.plate}</strong>
                            </td>
                            <td style={{ padding: '12px' }}>{item.brand} {item.model}</td>
                            <td style={{ padding: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span style={{
                                        padding: '6px 12px',
                                        borderRadius: '15px',
                                        fontSize: '0.85em',
                                        fontWeight: 'bold',
                                        backgroundColor: item.status === 'Terminé' ? '#d4edda' : '#fff3cd',
                                        color: item.status === 'Terminé' ? '#155724' : '#856404',
                                        minWidth: '70px',
                                        textAlign: 'center'
                                    }}>
                                        {item.status || 'En cours'}
                                    </span>
                                    {/* BOTÓN DE ACCIÓN RÁPIDA PARA CAMBIAR EL ESTADO */}
                                    <button
                                        onClick={() => handleUpdateStatus(item.id, item.status)}
                                        style={{
                                            padding: '4px 8px',
                                            fontSize: '0.7em',
                                            cursor: 'pointer',
                                            backgroundColor: item.status === 'Terminé' ? '#6c757d' : '#28a745',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            transition: '0.2s'
                                        }}
                                    >
                                        {item.status === 'Terminé' ? 'Réouvrir' : 'Terminer'}
                                    </button>
                                </div>
                            </td>
                            <td style={{ padding: '12px', color: '#444' }}>
                                {item.description}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MechanicDashboard;