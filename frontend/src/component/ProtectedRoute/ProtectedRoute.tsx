import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
    children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { isAuthenticated, toggleAuthModal } = useAuth();

    useEffect(() => {
        if (!isAuthenticated) {
            toggleAuthModal();
        }
    }, [isAuthenticated, toggleAuthModal]);

    if (!isAuthenticated) {
        return null; // Пока пользователь не авторизован, ничего не рендерим
    }

    return children;
};

export default ProtectedRoute;