import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import axios from "axios";

interface AuthState {
    isAuthenticated: boolean;
    accessToken: string;
    refreshToken: string;
}

interface AuthContextType extends AuthState {
    login: (tokens: { access: string; refresh: string }) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [authState, setAuthState] = useState<AuthState>({
        isAuthenticated: false,
        accessToken: null,
        refreshToken: null,
    });

    useEffect(() => {
        const access = localStorage.getItem("accessToken");
        const refresh = localStorage.getItem("refreshToken");

        if (access && refresh) {
            setAuthState({
                isAuthenticated: true,
                accessToken: access,
                refreshToken: refresh,
            });
        }
    }, []);

    const login = ({ access, refresh }: { access: string; refresh: string }) => {
        localStorage.setItem("accessToken", access);
        localStorage.setItem("refreshToken", refresh);
        setAuthState({
            isAuthenticated: true,
            accessToken: access,
            refreshToken: refresh,
        });
    };

    const logout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setAuthState({
            isAuthenticated: false,
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