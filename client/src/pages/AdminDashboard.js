import React, { useEffect, useState, useCallback } from "react";
import api from "../services/api.js";

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [newWorker, setNewWorker] = useState({
        email: "",
        password: "",
        roleId: 2,
    });

    // 1. Usamos useCallback para que la función no cambie en cada renderizado
    // Esto evita que el useEffect se dispare infinitamente o de forma síncrona peligrosa
    const fetchUsers = useCallback(async () => {
        try {
            const response = await api.get("/auth/users-list");
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
            await api.post("/auth/register", newWorker);
            alert("Ouvrier créé avec succès !");
            setNewWorker({ email: "", password: "", roleId: 2 });
            setShowForm(false);
            fetchUsers(); // Recargamos la lista tras crear uno nuevo
        } catch (error) {
            alert("Erreur: " + (error.response?.data?.message || "Erreur serveur"));
        }
    };

    return (
        <div className="flex flex-row justify-between w-full h-11/12 gap-12">
            <div className="flex flex-col gap-6 w-1/3 h-full justify-center items-center">
                <div className="fieldset bg-base-200 border-base-300 rounded-box w-md border p-12 flex flex-col gap-6">
                    {!showForm && (
                        <>
                            <h2 className="text-amber-50 font-bold text-lg">
                                Panneau d'administration - Gestion des ouvriers
                            </h2>

                            <button
                                onClick={() => setShowForm(!showForm)}
                                className="btn btn-info font-bold py-6 text-md text-amber-50 text-lg"
                            >
                                Ajouter un nouveau mécanicien
                            </button>
                        </>
                    )}

                    {showForm && (
                        <form
                            onSubmit={handleCreateWorker}
                            className="flex flex-col gap-6 w-full"
                        >
                            <h3 className="text-amber-50 font-bold text-lg">
                                Créer un compte employé
                            </h3>
                            <input
                                type="email"
                                placeholder="Email"
                                value={newWorker.email}
                                onChange={(e) =>
                                    setNewWorker({ ...newWorker, email: e.target.value })
                                }
                                className="input w-full"
                                required
                            />
                            <input
                                type="password"
                                placeholder="Mot de passe"
                                value={newWorker.password}
                                onChange={(e) =>
                                    setNewWorker({ ...newWorker, password: e.target.value })
                                }
                                className="input w-full"
                                required
                            />
                            <div className="flex gap-4 w-full justify-center">
                                <button
                                    onClick={() => setShowForm(!showForm)}
                                    className="btn btn-outline btn-error font-bold py-4 text-md w-23/48"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-success font-bold py-4 text-md w-23/48 text-amber-50"
                                >
                                    Enregistrer
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-4 w-2/3 h-full justify-center px-8">
                <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
                    <table border="1" className="table bg-zinc-900">
                        <thead>
                        <tr className="bg-slate-100 text-neutral-700">
                            <th>ID</th>
                            <th>Email</th>
                            <th>Rôle</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map((u) => (
                            <tr key={u.id}>
                                <td>{u.id}</td>
                                <td>{u.email}</td>
                                <td>
                                    {u.roleId === 1
                                        ? "Admin"
                                        : u.roleId === 2
                                            ? "Mécanicien"
                                            : "Client"}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
