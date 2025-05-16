import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import axios from "axios";
import { UserRole } from "../types/User";

interface AuthState {
    isAuthenticated: boolean;
    isManager: boolean;
    role: UserRole | null;
    accessToken: string | null;
    refreshToken: string | null;
}

interface AuthContextType extends AuthState {
    login: (tokens: { access: string; refresh: string }) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

// Function to decode JWT token
const decodeJWT = (token: string) => {
    try {
        // Split the token into three parts
        const base64Url = token.split('.')[1];
        // Replace non-url compatible chars with their alternatives
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        // Decode the base64 string
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        // Parse the JSON
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error("Error decoding JWT:", error);
        return null;
    }
};

// Function to extract role from JWT
const extractRoleFromToken = (token: string | null): UserRole | null => {
    if (!token) return null;
    
    try {
        const decoded = decodeJWT(token);
        
        // Extract the role from the JWT payload
        if (decoded && decoded.role) {
            // Make sure the role is one of our defined UserRole values
            if (Object.values(UserRole).includes(decoded.role)) {
                return decoded.role as UserRole;
            }
        }
        return null;
    } catch (error) {
        console.error("Error extracting role:", error);
        return null;
    }
};

// Function to check if user is a manager based on role
const checkIsManager = (role: UserRole | null): boolean => {
    return role === UserRole.MANAGER;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [authState, setAuthState] = useState<AuthState>({
        isAuthenticated: false,
        isManager: false,
        role: null,
        accessToken: null,
        refreshToken: null,
    });

    useEffect(() => {
        const access = localStorage.getItem("accessToken");
        const refresh = localStorage.getItem("refreshToken");

        if (access && refresh) {
            const role = extractRoleFromToken(access);
            setAuthState({
                isAuthenticated: true,
                isManager: checkIsManager(role),
                role,
                accessToken: access,
                refreshToken: refresh,
            });
        }
    }, []);

    const login = ({ access, refresh }: { access: string; refresh: string }) => {
        localStorage.setItem("accessToken", access);
        localStorage.setItem("refreshToken", refresh);
        
        const role = extractRoleFromToken(access);
        
        setAuthState({
            isAuthenticated: true,
            isManager: checkIsManager(role),
            role,
            accessToken: access,
            refreshToken: refresh,
        });
    };

    const logout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        
        setAuthState({
            isAuthenticated: false,
            isManager: false,
            role: null,
            accessToken: null,
            refreshToken: null,
        });
    };

    const contextValue = {
        ...authState,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within a AuthProvider");
    }
    return context;
};
