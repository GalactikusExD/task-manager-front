import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [users, setUsers] = useState([]);

    const registerUser = (user) => {
        setUsers([...users, user]);
    };

    const loginUser = (email, password) => {
        const user = users.find(u => u.email === email && u.password === password);
        return user ? { token: 'fake-token', user } : null;
    };

    return (
        <AuthContext.Provider value={{ registerUser, loginUser }}>
            {children}
        </AuthContext.Provider>
    );
};