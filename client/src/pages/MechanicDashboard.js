import React, { useState, useEffect, useCallback, useContext } from "react";
import api from "../services/api.js";
import { AuthContext } from "../context/AuthContext";

const MechanicDashboard = () => {
    const { user } = useContext(AuthContext);
    const [plate, setPlate] = useState("");
    const [car, setCar] = useState(null);
    const [showCarForm, setShowCarForm] = useState(false);
    const [newCar, setNewCar] = useState({ brand: "", model: "", ownerId: "" });
    const [repair, setRepair] = useState({
        description: "",
        cost: "",
        status: "En cours",
    });
    const [interventions, setInterventions] = useState([]);

    // Función para obtener todas las intervenciones
    const fetchInterventions = useCallback(async () => {
        try {
            const response = await api.get("/cars/interventions");
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
        const newStatus = currentStatus === "En cours" ? "Terminé" : "En cours";
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
                alert("Car non trouvé.");
                //setShowCarForm(true);
            } else {
                console.error("Détails de l'erreur:", error.response?.data);
                alert("Erreur lors de la recherche sur le serveur");
            }
        }
    };

    const handleCreateCar = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post("/cars", {
                plate: plate.trim().toUpperCase(),
                ...newCar,
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
            await api.post("/repairs", {
                carId: car.id,
                description: repair.description,
                cost: repair.cost,
                status: repair.status,
                mechanicId: user.id,
            });
            alert("Réparation ajoutée avec succès !");
            setRepair({ description: "", cost: "", status: "En cours" });
            setCar(null);
            setPlate("");
            fetchInterventions();
        } catch (error) {
            console.error("Erreur:", error.response);
            alert("Erreur de route ou de serveur");
        }
    };

    return (
        <div className="p-5 w-2/3 mx-auto">
            <h2 className="border-b-2 border-slate-200 pb-2 text-amber-50 font-bold text-xl mb-5">
                Atelier GearStack - Panneau Mécanicien
            </h2>

            <div
                className={`grid ${car || showCarForm ? "grid-cols-2" : "grid-cols-1"} gap-8`}
            >
                {/* Sección de Búsqueda */}
                <div className="p-5 bg-neutral-800 rounded-md shadow-md">
                    <h3 className="mb-4 font-bold text-lg text-slate-200">
                        Chercher un véhicule
                    </h3>
                    <div style={{ display: "flex", gap: "10px" }}>
                        <input
                            type="text"
                            placeholder="Plaque (ex: GEAR-2026)"
                            value={plate}
                            onChange={(e) => setPlate(e.target.value)}
                            className="input p-2 flex-1"
                        />
                        <button
                            onClick={handleSearch}
                            className="btn btn-info text-lg font-bold text-slate-100"
                        >
                            Chercher
                        </button>
                    </div>
                </div>

                {/* Formulario Nuevo Vehículo */}
                {showCarForm && (
                    <div className="p-5 bg-zinc-800 rounded-md shadow-md">
                        <h3 className="mb-4 font-bold text-slate-200">
                            Enregistrer {plate}
                        </h3>
                        <form onSubmit={handleCreateCar} className="flex flex-col gap-4">
                            <input
                                type="text"
                                placeholder="Marque"
                                onChange={(e) =>
                                    setNewCar({ ...newCar, brand: e.target.value })
                                }
                                className="input w-full"
                                required
                            />
                            <input
                                type="text"
                                placeholder="Modèle"
                                onChange={(e) =>
                                    setNewCar({ ...newCar, model: e.target.value })
                                }
                                className="input w-full"
                                required
                            />
                            <input
                                type="number"
                                placeholder="ID Client"
                                onChange={(e) =>
                                    setNewCar({ ...newCar, ownerId: e.target.value })
                                }
                                className="input w-full"
                                required
                            />
                            <button type="submit" className="btn w-full btn-warning">
                                Créer Véhicule
                            </button>
                        </form>
                    </div>
                )}

                {/* Formulario Nueva Reparación */}
                {car && (
                    <div className="p-5 bg-zinc-800 rounded-md shadow-md">
                        <h3 className="mb-4 font-bold text-slate-200">
                            Travail sur: {car.plate}
                        </h3>
                        <form onSubmit={handleCreateRepair} className="flex flex-col gap-4">
              <textarea
                  placeholder="Notes techniques..."
                  value={repair.description}
                  onChange={(e) =>
                      setRepair({ ...repair, description: e.target.value })
                  }
                  className="textarea w-full h-16"
                  required
              />
                            <div className="grid grid-cols-2 gap-4 w-full">
                                <input
                                    type="number"
                                    placeholder="Prix"
                                    value={repair.cost}
                                    onChange={(e) =>
                                        setRepair({ ...repair, cost: e.target.value })
                                    }
                                    className="input"
                                    required
                                />
                                <select
                                    value={repair.status}
                                    onChange={(e) =>
                                        setRepair({ ...repair, status: e.target.value })
                                    }
                                    class="select"
                                >
                                    <option value="En cours">En cours</option>
                                    <option value="Terminé">Terminé</option>
                                </select>
                            </div>
                            <button type="submit" className="btn w-full btn-success">
                                Enregistrer
                            </button>
                        </form>
                    </div>
                )}
            </div>

            {/* Tabla de Intervenciones */}
            <div className="mt-5">
                <h3 className="border-b-2 border-slate-200 pb-2 text-amber-50 font-bold text-xl mb-5">
                    Mes dernières interventions
                </h3>
                {interventions.length > 0 ? (
                    <table className="table bg-zinc-900 shadow-md">
                        <thead>
                        <tr className="bg-slate-100 text-neutral-800 text-center">
                            <th>Plaque</th>
                            <th>Modèle</th>
                            <th>Statut</th>
                            <th>Note</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {interventions
                            .flatMap((carItem) =>
                                (carItem.repairs || []).map((repairItem) => ({
                                    ...repairItem,
                                    plate: carItem.plate,
                                    brand: carItem.brand,
                                    model: carItem.model,
                                    carId: carItem.id,
                                })),
                            )
                            .map((item, index) => (
                                <tr key={`${item.id || index}`}>
                                    <td className="p-3">
                                        <strong className="text-slate-200">{item.plate}</strong>
                                    </td>
                                    <td>
                                        {item.brand} {item.model}
                                    </td>
                                    <td className="text-center">
                      <span
                          className={`py-4 rounded-2xl w-3/4 ${item.status === "Terminé" ? "badge badge-soft badge-success" : "badge badge-soft badge-warning"}`}
                      >
                        {item.status || "En cours"}
                      </span>
                                    </td>
                                    <td>
                      <span className="text-slate-400 text-left">
                        {item.description}
                      </span>
                                    </td>
                                    <td className="text-center">
                                        {/* BOTÓN DE ACCIÓN RÁPIDA PARA CAMBIAR EL ESTADO */}
                                        <button
                                            onClick={() => handleUpdateStatus(item.id, item.status)}
                                            className={`w-2/3 btn ${item.status === "Terminé" ? "btn-secondary" : "btn-success"}`}
                                        >
                                            {item.status === "Terminé" ? "Réouvrir" : "Terminer"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-center text-slate-400">
                        Aucune intervention trouvée.
                    </p>
                )}
            </div>
        </div>
    );
};

export default MechanicDashboard;
