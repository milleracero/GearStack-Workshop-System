import React, { useState, useMemo } from 'react';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user'); // Cambiamos roleId por el objeto user
        return token && savedUser ? JSON.parse(savedUser) : null;
    });

    const login = (token, userData) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    const authValue = useMemo(() => ({
        user, login, logout
    }), [user]);

    return React.createElement(AuthContext.Provider, { value: authValue }, children);
};