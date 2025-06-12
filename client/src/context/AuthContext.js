// client/my-app/src/context/AuthContext.js
import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';

// 1. Create the context
const AuthContext = createContext();

// 2. Create the provider component
const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token')); // Check for token on initial load
    const [isAuthenticated, setIsAuthenticated] = useState(!!token);

    useEffect(() => {
        // This effect runs when the token changes
        if (token) {
            // Store the token in localStorage to keep user logged in on refresh
            localStorage.setItem('token', token);
            setIsAuthenticated(true);
        } else {
            // Clear the token from localStorage
            localStorage.removeItem('token');
            setIsAuthenticated(false);
        }
    }, [token]);

    // --- Login Function ---
    const login = async (username, password) => {
        const response = await axios.post('http://localhost:5001/api/users/login', {
            username,
            password,
        });
        setToken(response.data.token); // Set the new token, which triggers the useEffect
    };

    // --- Logout Function ---
    const logout = () => {
        setToken(null); // Clear the token, which triggers the useEffect
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// 3. Export the provider and the context
export { AuthContext, AuthProvider };
