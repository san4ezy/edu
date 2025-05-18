import React from "react";
import {Navigate} from "react-router-dom";
import {useAuth} from "../context/AuthContext";

interface PrivateRouteProps {
    element: React.ReactElement;
}

function PrivateRoute({ element }: PrivateRouteProps) {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return element;
}

export default PrivateRoute;