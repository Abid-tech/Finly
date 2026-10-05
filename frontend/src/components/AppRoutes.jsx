// src/components/AppRoutes.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../providers/authContext.provider';

import Home from '../pages/home/home';
import Dashboard from '../pages/dashboard/dashboard';

function AppRoutes() {
    const { user,loading } = useContext(AuthContext); 

    if(loading){
        return null
    }

    return (
        <Routes>
            {user ? (
                <>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                </>
            ) : (
                <>
                    <Route path="/" element={<Home />} />
                    <Route path="/dashboard" element={<Navigate to="/" replace />} />
                </>
            )}
        </Routes>
    );
}

export default AppRoutes;