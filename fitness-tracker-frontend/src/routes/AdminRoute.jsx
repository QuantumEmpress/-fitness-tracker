import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const AdminRoute = () => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return <div>Loading...</div>;
    }

    // Check if user exists and has ROLE_ADMIN
    // The backend returns roles as a list of strings, e.g., ["ROLE_USER", "ROLE_ADMIN"]
    const isAdmin = user && user.roles && user.roles.includes('ROLE_ADMIN');

    return isAdmin ? <Outlet /> : <Navigate to="/dashboard" />;
};

export default AdminRoute;
