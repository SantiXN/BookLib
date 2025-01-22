import React, { useEffect, useRef, useState } from 'react';
import s from '../FunctionalWindow.module.css'
import { UserData } from '../../../../../api';
import useApi from '../../../../../api/ApiClient';

interface BlockProps {
    isOpen: string | null;
    onClose: () => void;
}

const RemoveUserBlock: React.FC<BlockProps> = ({ isOpen, onClose }) => {
    const { UserApi } = useApi();
    
    const containerRef = useRef<HTMLDivElement>(null);

    const [users, setUsers] = useState<UserData[]>([]);
    const [selectedUserID, setSelectedUserID] = useState<number | null>(null);

    useEffect(() => {
        UserApi.listUsers()
            .then((response) => {
                if (response?.users) {
                    setUsers(response.users);
                } else {
                    console.error('No users found');
                }
            })
            .catch((error) => {
                console.error('Ошибка загрузки пользователей:', error);
            });
    }, []);
    
    const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
            onClose();        
        }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            onClose();
        }
    };

    useEffect(() => {
        if (isOpen != null) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleEscapeKey);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [isOpen]);

    const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const userId = Number(e.target.value);
        setSelectedUserID(userId);
    }; 

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!selectedUserID || !users.some(user => user.id === selectedUserID)) return;

        const confirmDelete = window.confirm('Вы уверены, что хотите удалить этого пользователя? Это действие необратимо.');
        if (!confirmDelete) return;
        
        UserApi.deleteUser({ userID: selectedUserID })
            .then(() => {
                alert('Пользователь успешно удален!');
                onClose();
            })
        .catch((error) => {
            console.error('Ошибка удаления пользователя:', error);
            alert('Не удалось удалить пользователя. Попробуйте позже.');
        });
    };    

        
    return (
        <div className={s.container}>
            <div ref={containerRef} className={s.block}>
                <div className={s.menuHeader}>
                    <p className={s.menuTitle}>Удалить пользователя</p>
                    <span onClick={onClose} className={s.closeIcon} />
                </div>
                <div className={s.menuContainer}>
                    <form className={s.form} onSubmit={handleSubmit}>
                        <div className={s.formFieldContainer}>
                            <label className={s.formLabel} htmlFor='users'>Пользователь</label>
                            <select id="users" className={s.input} value={selectedUserID || ''} onChange={handleUserChange}>
                                <option value='' disabled>Выберите...</option>
                                {users.map((user, index) => (
                                    <option key={index} value={user.id}>
                                        {user.firstName} {user.lastName} (id={user.id})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className={s.actionButtonContainer}>
                            <button
                                type="submit"
                                className={`${s.button} ${s.formButton} ${!selectedUserID ? s.disabledButton : ""}`}
                                disabled={!selectedUserID}
                            >
                                Удалить
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default RemoveUserBlock;