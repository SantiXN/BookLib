import React, { useEffect, useRef } from 'react';
import s from '../FunctionalWindow.module.css'

interface BlockProps {
    isOpen: string | null;
    onClose: () => void;
}

const RemoveAuthorBlock: React.FC<BlockProps> = ({ isOpen, onClose }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    
    const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
            console.log('click');
            onClose();        
        }
    };

    useEffect(() => {
        if (isOpen != null) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

        
    return (
        <div className={s.container}>
            <div ref={containerRef} className={s.block}>
                <div className={s.menuHeader}>
                    <p className={s.menuTitle}>Удалить автора</p>
                    <span onClick={onClose} className={s.closeIcon} />
                </div>
            </div>
        </div>
    )
}

export default RemoveAuthorBlock;