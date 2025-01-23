import React, { useEffect, useRef, useState } from 'react';
import s from '../FunctionalWindow.module.css'
import { UserInfo } from '../../../../../api';
import useApi from '../../../../../api/ApiClient';

interface BlockProps {
    isOpen: string | null;
    onClose: () => void;
}

const RemoveUserBlock: React.FC<BlockProps> = ({ isOpen, onClose }) => {
    const { UserApi } = useApi();
    
    const containerRef = useRef<HTMLDivElement>(null);

    const [selectedUserID, setSelectedUserID] = useState<number | null>(null);

    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    
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

    const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const userId = Number(e.target.value);
        setSelectedUserID(userId);
    }; 

    const handleSearchUser = () => {
        if (!selectedUserID) return;

        UserApi.getUserInfo({ userID: selectedUserID})
            .then((response) => {
                if (response.user) {
                    if (response.user.role == 'admin') {
                        alert('Удалить администратора нельзя! Ай-яй-яй');
                        return;
                    }
                    setUserInfo(response.user);
                }
            })
            .catch(() => alert('Пользовать с заданным ID не найден!'));
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!userInfo || !selectedUserID) return;

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
                        <div className={`${s.formFieldContainer} ${s.inputContainerFromId}`}>
                            <label className={s.formLabel} htmlFor='userId'>ID пользователя</label>
                            <input
                                className={`${s.input} ${s.autoWidth}`}
                                id='userId'
                                type='number'  
                                value={selectedUserID || ''}
                                onChange={(value) => handleUserChange(value)}
                            />
                            <button
                                type="button"
                                onClick={handleSearchUser}
                                disabled={!selectedUserID}
                                className={`${s.button} ${!selectedUserID ? s.disabledButton : ''}`}
                            >
                                Поиск
                            </button>
                        </div>
                        {userInfo && (
                            <div>
                                <p>E-mail: {userInfo.email}</p>
                                <p>Имя, фамилия: {userInfo.firstName} {userInfo.lastName}</p>
                                <p>Роль: {userInfo.role}</p>
                            </div>
                        )}
                        <div className={s.actionButtonContainer}>
                            <button
                                type="submit"
                                className={`${s.button} ${s.formButton} ${!userInfo ? s.disabledButton : ""}`}
                                disabled={!userInfo}
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