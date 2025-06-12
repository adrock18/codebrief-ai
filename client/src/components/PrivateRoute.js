// client/my-app/src/components/PrivateRoute.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
    const { isAuthenticated } = useContext(AuthContext);

    // If user is authenticated, show the page. Otherwise, redirect to /login.
    return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;