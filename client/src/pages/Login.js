import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../services/api.js";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post("/auth/login", { email, password });
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
        <div className="min-h-screen flex items-center justify-center bg-neutral-900 text-amber-50">
            <div className="flex flex-col gap-6 max-w-sm p-10 bg-neutral-800 shadow-md text-center w-1/4">
                <h2 className="text-xl text-amber-50">GearStack - Connexion</h2>
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
                    <button type="submit" className="btn btn-info text-amber-50">
                        Se connecter
                    </button>
                </form>

                <p className="text-sm text-amber-50">
                    Vous n'avez pas de compte ?{" "}
                    <Link to="/register" className="link link-info">
                        Inscrivez-vous ici
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
