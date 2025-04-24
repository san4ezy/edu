import React from "react";
import {Navigate} from "react-router-dom";

const isAuthenticated = () => {
    // Fake false imitates unauthorized users
    return false;
};

interface PrivateRouteProps {
    element: React.ReactElement;
}

function PrivateRoute({ element }: PrivateRouteProps) {
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }
    return element;
}

export default PrivateRoute;