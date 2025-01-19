import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AuthMenu from '../component/AuthMenu/AuthMenu';

interface AuthContextType {
    isAuthenticated: boolean;
    logIn: (token: string) => void;
    logOut: () => void;
    toggleAuthModal: (targetUrl?: string) => void;
    isAuthMenuOpen: boolean;
    targetUrl: string | null;
    isLoggingOut: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isAuthMenuOpen, setIsAuthMenuOpen] = useState<boolean>(false);
    const [targetUrl, setTargetUrl] = useState<string | null>(null);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    const login = (token: string) => {
        localStorage.setItem('token', token);
        setIsAuthenticated(true);
        setIsAuthMenuOpen(false);
        setIsLoggingOut(false);
        if (targetUrl) {
            window.location.href = targetUrl;
            setTargetUrl(null);
        }
    };

    const logout = () => {
        setIsLoggingOut(true); // Устанавливаем флаг перед выходом
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setIsLoggingOut(false); // Сброс флага после выхода
    };

    const toggleAuthModal = (url?: string) => {
        if (url) setTargetUrl(url);
        setIsAuthMenuOpen((prev) => !prev);
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                logIn: login,
                logOut: logout,
                toggleAuthModal,
                isAuthMenuOpen,
                targetUrl,
                isLoggingOut
            }}
        >
            {children}
            {isAuthMenuOpen && (
                <AuthMenu
                    isOpen={isAuthMenuOpen}
                    onClose={() => toggleAuthModal()}
                    to={targetUrl}
                />
            )}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
