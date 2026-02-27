import React, { useContext } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import { AuthContext } from "./context/AuthContext";

// Importación de las páginas reales
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import MechanicDashboard from "./pages/MechanicDashboard";
import ClientDashboard from "./pages/ClientDashboard"; // Importado correctamente

function App() {
    const { user, logout } = useContext(AuthContext);

    // Función para mostrar el nombre del rol en la interfaz
    const getRoleName = (roleId) => {
        const id = Number(roleId);
        if (id === 1) return "Admin";
        if (id === 2) return "Mécanicien";
        return "Client";
    };

    return (
        <Router>
            <div className="App h-screen min-h-screen bg-neutral-900">
                {/* Navbar: Solo visible si el usuario está logueado */}
                {user && (
                    <nav className="navbar bg-neutral text-neutral-content shadow-sm h-1/12">
                        <div className="navbar-start">
              <span className="text-lg font-semibold">
                GearStack - Rôle: <strong>{getRoleName(user.roleId)}</strong>
              </span>
                        </div>
                        <div className="navbar-end">
                            <button onClick={logout} className="btn btn-soft btn-accent">
                                Déconnexion
                            </button>
                        </div>
                    </nav>
                )}

                <Routes>
                    {/* FLUJO PÚBLICO: Si no hay usuario, solo Login y Registro */}
                    {!user ? (
                        <>
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="*" element={<Navigate to="/login" />} />
                        </>
                    ) : (
                        /* FLUJO PRIVADO: Rutas protegidas por RoleID */
                        <>
                            {/* Ruta para Admin (ID 1) */}
                            {user.roleId == 1 && (
                                <Route path="/admin" element={<AdminDashboard />} />
                            )}

                            {/* Ruta para Mecánico (ID 2) */}
                            {user.roleId == 2 && (
                                <Route path="/mechanic" element={<MechanicDashboard />} />
                            )}

                            {/* Ruta para Cliente (ID 3) */}
                            {user.roleId == 3 && (
                                <Route path="/client" element={<ClientDashboard />} />
                            )}

                            {/* Redirección inteligente: Si el usuario intenta ir a una ruta que no existe
                                o a la raíz "/", lo mandamos a su panel correspondiente */}
                            <Route
                                path="*"
                                element={
                                    user.roleId == 1 ? (
                                        <Navigate to="/admin" />
                                    ) : user.roleId == 2 ? (
                                        <Navigate to="/mechanic" />
                                    ) : (
                                        <Navigate to="/client" />
                                    )
                                }
                            />
                        </>
                    )}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
