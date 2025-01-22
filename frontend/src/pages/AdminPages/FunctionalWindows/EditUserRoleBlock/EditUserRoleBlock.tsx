import { useEffect, useRef, useState } from 'react';
import s from '../FunctionalWindow.module.css';
import useApi from '../../../../../api/ApiClient';
import { ChangeUserRoleRequestRoleEnum, UserInfo } from '../../../../../api';

interface BlockProps {
    isOpen: string | null;
    onClose: () => void;
}

const EditUserRoleBlock: React.FC<BlockProps> = ({ isOpen, onClose }) => {
    const { UserApi } = useApi();

    const containerRef = useRef<HTMLDivElement>(null);

    const [users, setUsers] = useState<UserInfo[]>([]);
    const [selectedUser, setSelectedUser] = useState<UserInfo | null>(null);
    const [selectedRole, setSelectedRole] = useState<string>('');
    const [isRoleChanged, setIsRoleChanged] = useState<boolean>(false); 

    
    const handleUserChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const userId = Number(event.target.value);
        const user = users.find((u) => u.id === userId) || null;
        setSelectedUser(user);
        setSelectedRole(user?.role || ''); 
        setIsRoleChanged(false);
    };

    const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedRole(event.target.value);
        setIsRoleChanged(event.target.value !== selectedUser?.role);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser || !selectedRole) return;

        try {
            // TODO: Проверить правильность работы
            const request: ChangeUserRoleRequestRoleEnum = selectedRole as ChangeUserRoleRequestRoleEnum;
            await UserApi.changeUserRole({ userID: selectedUser.id, changeUserRoleRequest: {role: request} });
            alert('Роль пользователя успешно обновлена!');
            setIsRoleChanged(false); 
        } catch (error) {
            console.error('Ошибка обновления роли пользователя:', error);
            alert('Не удалось обновить роль. Попробуйте позже.');
        }
    };

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

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleEscapeKey);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [isOpen]);

    return (
        <div className={s.container}>
            <div ref={containerRef} className={`${s.block} ${s.articleBlock}`}>
                <div className={s.menuHeader}>
                    <p className={s.menuTitle}>Редактировать роль пользователя</p>
                    <span onClick={onClose} className={s.closeIcon} />
                </div>
                <div className={s.menuContainer}>
                    <form className={s.form} onSubmit={handleSubmit}>
                        <div className={s.formFieldContainer}>
                            <label className={s.formLabel} htmlFor="users">Пользователь</label>
                            <select
                                id="users"
                                className={s.input}
                                value={selectedUser?.id || ''}
                                onChange={handleUserChange}
                            >
                                <option value="" disabled>Выберите...</option>
                                {users.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.firstName} {user.lastName} ({user.email})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className={s.formFieldContainer}>
                            <label className={s.formLabel} htmlFor="roles">Роль</label>
                            <select
                                id="roles"
                                className={s.input}
                                value={selectedRole}
                                onChange={handleRoleChange}
                                disabled={!selectedUser} // Блокируем выбор, если пользователь не выбран
                            >
                                <option value="" disabled>Выберите...</option>
                                <option value="user">Обычный пользователь</option>
                                <option value="editor">Редактор</option>
                            </select>
                        </div>
                        <div className={s.actionButtonContainer}>
                            <button
                                type="submit"
                                className={`${s.button} ${s.formButton} ${!isRoleChanged ? s.disabledButton : ''}`}
                                disabled={!isRoleChanged}
                            >
                                Редактировать
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditUserRoleBlock;
