import React, { useEffect, useState, useCallback, useContext } from "react";
import api from "../services/api.js";
import { AuthContext } from "../context/AuthContext";

const ClientDashboard = () => {
    const { user } = useContext(AuthContext);
    const [vehicles, setVehicles] = useState([]);
    const [selectedCar, setSelectedCar] = useState(null);
    const [repairs, setRepairs] = useState([]);


    const [showAddForm, setShowAddForm] = useState(false);
    const [newCar, setNewCar] = useState({ plate: "", brand: "", model: "" });


    const fetchMyVehicles = useCallback(async () => {
        if (!user || !user.id) return;

        try {
            const response = await api.get(`/cars/owner/${user.id}`);
            setVehicles(response.data || []);
        } catch (error) {
            console.error("Error loading vehicles:", error);
        }
    }, [user]);


    const fetchRepairs = async (carId) => {
        try {
            const response = await api.get(`/repairs/car/${carId}`);
            setRepairs(response.data || []);
            setSelectedCar(vehicles.find((v) => v.id === carId));
        } catch (error) {
            console.error("Error loading repairs:", error);
        }
    };


    const handleAddCar = async (e) => {
        e.preventDefault();
        try {
            await api.post("/cars", newCar);
            alert("Véhicule enregistré avec succès !");
            setNewCar({ plate: "", brand: "", model: "" });
            setShowAddForm(false);
            fetchMyVehicles(); // Refresh the list automatically after creation
        } catch (error) {
            console.error("Error:", error.response?.data);
            alert(error.response?.data?.message || "Erreur lors de l'enregistrement");
        }
    };


    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchMyVehicles();
    }, [fetchMyVehicles]);

    return (
        <div className="p-5 mx-auto h-11/12">
            <h2 className="border-b-2 mt-4 border-blue-500 pb-2 text-amber-50 text-2xl font-bold">
                Mon Garage Virtuel
            </h2>

            <div className="grid grid-cols-2 gap-8 mt-5 h-11/12">
                {/* --- SECTION: VEHICLE LIST --- */}
                <section className="flex flex-col justify-center items-center">
                    {!showAddForm && (
                        <div className="flex flex-col gap-5 mb-4">
                            <div className="flex items-center gap-4 w-full justify-between">
                                <h3 className="text-amber-50 font-bold text-lg">
                                    Mes Véhicules
                                </h3>
                                <button
                                    onClick={() => setShowAddForm(!showAddForm)}
                                    className="btn btn-info text-amber-50 text-lg font-bold px-8"
                                >
                                    {showAddForm ? "Annuler" : "+ Ajouter"}
                                </button>
                            </div>

                            {vehicles.length === 0 ? (
                                <p className="text-md font-light text-slate-300">
                                    Aucun véhicule enregistré à votre nom.
                                </p>
                            ) : (
                                vehicles.map((v) => (
                                    <div
                                        key={v.id}
                                        onClick={() => fetchRepairs(v.id)}
                                        className={`p-4 mb-2  rounded-md shadow-lg cursor-pointer hover:bg-neutral-700 ${selectedCar?.id === v.id ? "bg-slate-600 border-2 border-stone-400 hover:bg-slate-600" : "bg-neutral-800"}`}
                                    >
                                        <strong className="text-lg text-amber-50">
                                            {v.brand} {v.model}
                                        </strong>
                                        <p className="text-sm text-slate-50">
                                            <strong className="text-slate-100">Plaque:</strong>{" "}
                                            {v.plate}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* Registration Form UI */}
                    {showAddForm && (
                        <div className="bg-neutral-800 p-5 mb-5 shadow-2xl flex flex-col gap-8 w-lg">
                            <h4 className="text-amber-50 font-bold text-lg border-b-2 border-gray-300 pb-2">
                                Enregistrer un véhicule
                            </h4>
                            <form onSubmit={handleAddCar} className="flex flex-col gap-4">
                                <input
                                    type="text"
                                    placeholder="Plaque (ex: ABC-123)"
                                    required
                                    value={newCar.plate}
                                    onChange={(e) =>
                                        setNewCar({ ...newCar, plate: e.target.value })
                                    }
                                    className="input w-full"
                                />
                                <input
                                    type="text"
                                    placeholder="Marque (ex: Toyota)"
                                    required
                                    value={newCar.brand}
                                    onChange={(e) =>
                                        setNewCar({ ...newCar, brand: e.target.value })
                                    }
                                    className="input w-full"
                                />
                                <input
                                    type="text"
                                    placeholder="Modèle (ex: Corolla)"
                                    required
                                    value={newCar.model}
                                    onChange={(e) =>
                                        setNewCar({ ...newCar, model: e.target.value })
                                    }
                                    className="input w-full"
                                />
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => setShowAddForm(!showAddForm)}
                                        className="btn btn-outline btn-error text-lg font-bold w-23/48"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-success text-amber-50 text-lg font-bold ml-4 w-23/48"
                                    >
                                        Confirmer l'ajout
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </section>

                {/* --- SECTION: REPAIR HISTORY --- */}
                <section className="flex flex-col justify-center items-center w-full">
                    <h3 className="text-amber-50 font-bold text-xl mb-4">
                        Historique des Réparations
                    </h3>
                    {!selectedCar ? (
                        <div className="p-5 bg-neutral-800 rounded-xl text-center w-full border-dashed border-2 border-gray-600">
                            <p className="text-slate-400 font-light">
                                Sélectionnez un véhicule pour voir son historique.
                            </p>
                        </div>
                    ) : (
                        <div className="p-4 shadow-md bg-zinc-900 w-full">
                            <h4 className="text-slate-100 font-bold text-lg border-b-2 border-gray-300 pb-2 mb-4">
                                {selectedCar.brand} — {selectedCar.plate}
                            </h4>
                            {repairs.length === 0 ? (
                                <p className="text-slate-300 font-light text-md">
                                    Aucune réparation enregistrée pour ce véhicule.
                                </p>
                            ) : (
                                <table className="table">
                                    <thead className="text-slate-200 text-center">
                                    <tr>
                                        <th>Description</th>
                                        <th>Statut</th>
                                        <th>Coût</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {repairs.map((r) => (
                                        <tr key={r.id} className="text-center">
                                            <td className="text-slate-300 text-left">
                                                {r.description}
                                            </td>
                                            <td>
                                                <span
                                                    className={`py-4 rounded-2xl w-3/4 ${r.status === "Terminé" ? "badge badge-soft badge-success" : "badge badge-soft badge-warning"}`}
                                                >
                                                    {r.status || "En cours"}
                                                </span>
                                            </td>
                                            <td className="font-bold text-slate-50">
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