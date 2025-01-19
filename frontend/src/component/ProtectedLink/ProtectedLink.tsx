import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedLinkProps {
    to: string;
    children: React.ReactNode;
    className?: string;
}

const ProtectedLink: React.FC<ProtectedLinkProps> = ({ to, children, className }) => {
    const { isAuthenticated, toggleAuthModal } = useAuth();
    const navigate = useNavigate();

    const handleClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.preventDefault();
        if (isAuthenticated) {
            navigate(to);
        } else {
            toggleAuthModal(to);
        }
    };

    return (
        <a href={to} className={className} onClick={handleClick}>
            {children}
        </a>
    );
};

export default ProtectedLink;
