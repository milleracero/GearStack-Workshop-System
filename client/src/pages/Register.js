import React, { useState } from "react";
import api from "../services/api.js";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Forzamos el roleId a 3 porque es un registro de cliente público
            await api.post("/auth/register", { email, password, roleId: 3 });

            alert("Compte créé avec succès ! Connectez-vous.");
            navigate("/login");
        } catch (error) {
            console.error("Erreur d'inscription:", error);
            alert(
                "Erreur: " +
                (error.response?.data?.message || "Impossible de créer le compte"),
            );
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-900 text-amber-50">
            <div className="flex flex-col gap-6 max-w-sm p-10 bg-neutral-800 shadow-md text-center w-1/4">
                <h2 className="text-xl text-amber-50">GearStack - Créer un compte</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input"
                        required
                    />
                    <button type="submit" className="btn btn-success text-amber-50">
                        S'inscrire
                    </button>
                </form>

                <p className="text-sm text-amber-50">
                    ¿Ya tienes cuenta?{" "}
                    <Link to="/login" className="link link-info">
                        Inicia sesión
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
