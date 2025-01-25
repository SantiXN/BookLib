import { useState } from 'react';
import s from '../FunctionalWindow.module.css';
import useApi from '../../../../../api/ApiClient';
import { ChangeUserRoleRequestRoleEnum, UserInfo } from '../../../../../api';

interface BlockProps {
    onClose: () => void;
}

const EditUserRoleBlock: React.FC<BlockProps> = ({ onClose }) => {
    const { UserApi } = useApi();

    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

    const [selectedUser, setSelectedUser] = useState<UserInfo | null>(null);
    const [selectedRole, setSelectedRole] = useState<string>('');
    const [isRoleChanged, setIsRoleChanged] = useState<boolean>(false); 
    
    const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const userId = Number(e.target.value);
        setSelectedUserId(userId);
    }; 

    const handleSearchUser = () => {
        if (!selectedUserId) return;

        UserApi.getUserInfo({ userID: selectedUserId})
            .then((response) => {
                if (response.user.role == 'admin') {
                    alert('Роль администратора изменить нельзя!');
                    return;
                }
                if (response.user) {
                    setSelectedUser(response.user);
                    setSelectedRole(response.user.role || '')
                }
            })
            .catch(() => alert('Пользовать с заданным ID не найден!'));
    }

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

    const close = () => {
        const confirmDelete = window.confirm('Вы точно хотите закрыть окно?');
        if (!confirmDelete) return;

        onClose();
    }

    return (
        <div className={s.container}>
            <div className={`${s.block} ${s.articleBlock}`}>
                <div className={s.menuHeader}>
                    <p className={s.menuTitle}>Редактировать роль пользователя</p>
                    <span onClick={close} className={s.closeIcon} />
                </div>
                <div className={s.menuContainer}>
                    <form className={s.form} onSubmit={handleSubmit}>
                        <div className={`${s.formFieldContainer} ${s.inputContainerFromId}`}>
                            <label className={s.formLabel} htmlFor='userId'>ID пользователя</label>
                            <input
                                className={`${s.input} ${s.autoWidth}`}
                                id='userId'
                                type='number'  
                                value={selectedUserId || ''}
                                onChange={(value) => handleUserChange(value)}
                            />
                            <button
                                type="button"
                                onClick={handleSearchUser}
                                disabled={!selectedUserId}
                                className={`${s.button} ${!selectedUserId ? s.disabledButton : ''}`}
                            >
                                Поиск
                            </button>
                        </div>
                        {selectedUser && (
                            <div className={s.formFieldContainer}>
                                <div>
                                    <p>Имя: {selectedUser.firstName}</p>
                                    <p>Фамилия: {selectedUser.lastName}</p>
                                    <p>E-mail: {selectedUser.email}</p>
                                </div>
                                <label className={s.formLabel} htmlFor="roles">Роль</label>
                                <select
                                    id="roles"
                                    className={s.input}
                                    value={selectedRole}
                                    onChange={handleRoleChange}
                                    disabled={!selectedUser}
                                >
                                    <option value="" disabled>Выберите...</option>
                                    <option value="user">Обычный пользователь</option>
                                    <option value="editor">Редактор</option>
                                </select>
                            </div>
                        )}
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
