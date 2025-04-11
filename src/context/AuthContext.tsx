import { createContext, useContext, ReactNode, useState, useEffect } from 'react';

interface AuthContextType {
    isAuthenticated: boolean;
    login: () => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    // In a real app, you would check localStorage or a token here
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    // Check if user was previously logged in (e.g., from localStorage)
    useEffect(() => {
        const storedAuthStatus = localStorage.getItem('isAuthenticated');
        if (storedAuthStatus === 'true') {
            setIsAuthenticated(true);
        }
    }, []);

    const login = () => {
        // In a real app, this would involve API calls, token storage, etc.
        setIsAuthenticated(true);
        localStorage.setItem('isAuthenticated', 'true');
    };

    const logout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('isAuthenticated');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};