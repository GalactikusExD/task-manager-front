import React, { createContext, useState } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const registerUser = async (userData) => {
        try {
            const response = await axios.post('http://localhost:5000/api/auth/register', userData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Error en el registro');
        }
    };

    const loginUser = async (email, password) => {
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            const { token, user } = response.data;
            localStorage.setItem('token', token); // Guardar el token en localStorage
            setUser(user); // Guardar el usuario en el estado
            return user; // Devuelve el usuario
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Error en el inicio de sesión');
        }
    };

    const logoutUser = () => {
        localStorage.removeItem('token'); // Eliminar el token
        setUser(null); // Limpiar el usuario
    };

    return (
        <AuthContext.Provider value={{ user, registerUser, loginUser, logoutUser }}>
            {children}
        </AuthContext.Provider>
    );
};