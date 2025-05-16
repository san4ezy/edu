import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { UserRole } from "../types/User";

interface ManagerRouteProps {
    element: React.ReactElement;
}

function ManagerRoute({ element }: ManagerRouteProps) {
    const { isAuthenticated, isManager, role } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    
    if (!isManager || role !== UserRole.MANAGER) {
        return <Navigate to="/" replace />;
    }

    return element;
}

export default ManagerRoute;