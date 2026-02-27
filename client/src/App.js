import React, { useContext } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import { AuthContext } from "./context/AuthContext";

// Real page imports
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import MechanicDashboard from "./pages/MechanicDashboard";
import ClientDashboard from "./pages/ClientDashboard";

function App() {
    const { user, logout } = useContext(AuthContext);


    const getRoleName = (roleId) => {
        const id = Number(roleId);
        if (id === 1) return "Admin";
        if (id === 2) return "Mécanicien";
        return "Client";
    };

    return (
        <Router>
            <div className="App h-screen min-h-screen bg-neutral-900">
                {/* Navbar: Only rendered if the user is authenticated */}
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
                    {/** * PUBLIC FLOW:
                     * If no user is logged in, only Login and Register routes are accessible.
                     */}
                    {!user ? (
                        <>
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="*" element={<Navigate to="/login" />} />
                        </>
                    ) : (
                        /** * PRIVATE FLOW:
                         * Routes protected by RoleID logic.
                         */
                        <>
                            {/* Admin Route (ID 1) */}
                            {user.roleId == 1 && (
                                <Route path="/admin" element={<AdminDashboard />} />
                            )}

                            {/* Mechanic Route (ID 2) */}
                            {user.roleId == 2 && (
                                <Route path="/mechanic" element={<MechanicDashboard />} />
                            )}

                            {/* Client Route (ID 3) */}
                            {user.roleId == 3 && (
                                <Route path="/client" element={<ClientDashboard />} />
                            )}

                            /** * SMART REDIRECTION:
                            * If a logged-in user hits a non-existent route or the root "/",
                            * they are redirected to their specific dashboard based on their role.
                            */
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