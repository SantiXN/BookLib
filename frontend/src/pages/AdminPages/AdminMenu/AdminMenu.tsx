import { useEffect, useState } from 'react';
import s from './AdminMenu.module.css'
import AddAuthorBlock from '../FunctionalWindows/AddAuthorBlock/AddAuthorBlock';
import AddBookBlock from '../FunctionalWindows/AddBookBlock/AddBookBlock';
import RemoveAuthorBlock from '../FunctionalWindows/RemoveAuthorBlock/RemoveAuthorBlock';
import RemoveBookBlock from '../FunctionalWindows/RemoveBookBlock/RemoveBookBlock';
import EditAuthorBlock from '../FunctionalWindows/EditAuthorBlock/EditAuthorBlock';
import EditBookBlock from '../FunctionalWindows/EditBookBlock/EditBookBlock';
import AddArticleBlock from '../FunctionalWindows/AddArticleBlock/AddArticleBlock';
import EditArticleBlock from '../FunctionalWindows/EditArticleBlock/EditArticleBlock';
import RemoveArticleBlock from '../FunctionalWindows/RemoveArticleBlock/RemoveArticleBlock';
import EditUserRoleBlock from '../FunctionalWindows/EditUserRoleBlock/EditUserRoleBlock';
import RemoveUserBlock from '../FunctionalWindows/RemoveUserBlock/RemoveUserBlock';
import useApi from '../../../../api/ApiClient';
import { UserInfoRoleEnum } from '../../../../api';
import { useNavigate } from 'react-router-dom';

const AdminMenu = () => {
    const { UserApi } = useApi();

    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);
    
    useEffect(() => {
        UserApi.getAuthorizedUser()
            .then((response) => {
                if (response.user.role !== UserInfoRoleEnum.Admin) {
                    alert('Ошибка прав доступа!')
                    navigate('/');
                } else {
                    setIsAdmin(true);
                }
            })
            .catch((error) => {
                console.error('Error fetching user data:', error);
                navigate('/');
            });
    }, [navigate]);

    const [activeWindowMenu, setActiveWindowMenu] = useState<string | null>(null);

    const handleButtonClick = (window: string) => setActiveWindowMenu(window); 

    const closeWindow = () => setActiveWindowMenu(null);

    if (!isAdmin) return null;
    
    return (
        <div className={s.adminMenuContainer}>
            <p className={s.title}>Меню администратора</p>
            <div className={s.adminMenuButtons}>
                <div className={s.adminMenuButtonsContainer}>
                    <p className={s.entity}>Автор</p>
                    <div className={s.buttonsContainer}>
                        <button className={s.button} onClick={() => handleButtonClick('addAuthor')}>Добавить автора</button>
                        <button className={s.button} onClick={() => handleButtonClick('editAuthor')}>Редактировать данные автора</button>
                        <button className={s.button} onClick={() => handleButtonClick('removeAuthor')}>Удалить автора</button>
                    </div>
                </div>
                <div className={s.adminMenuButtonsContainer}>
                    <p className={s.entity}>Книга</p>
                    <div className={s.buttonsContainer}>
                        <button className={s.button} onClick={() => handleButtonClick('addBook')}>Добавить книгу</button>
                        <button className={s.button} onClick={() => handleButtonClick('editBook')}>Редактировать книгу</button>                    
                        <button className={s.button} onClick={() => handleButtonClick('removeBook')}>Удалить книгу</button>
                    </div>
                </div>
                <div className={s.adminMenuButtonsContainer}>
                    <p className={s.entity}>Статья</p>
                    <div className={s.buttonsContainer}>
                        <button className={s.button} onClick={() => handleButtonClick('editArticle')}>Редактировать статью</button>                    
                        <button className={s.button} onClick={() => handleButtonClick('removeArticle')}>Удалить статью</button>
                    </div>
                </div>
                <div className={s.adminMenuButtonsContainer}>
                    <p className={s.entity}>Пользователь</p>
                    <div className={s.buttonsContainer}>
                        <button className={s.button} onClick={() => handleButtonClick('editUserRole')}>Редактировать роль пользователя</button>                    
                        <button className={s.button} onClick={() => handleButtonClick('removeUser')}>Удалить пользователя</button>
                    </div>
                </div>
            </div>

            {activeWindowMenu === 'addAuthor' && (
                <AddAuthorBlock onClose={closeWindow}/>
            )}
            {activeWindowMenu === 'addBook' && (
                <AddBookBlock onClose={closeWindow}/>
            )}
            {activeWindowMenu === 'removeAuthor' && (
                <RemoveAuthorBlock onClose={closeWindow}/>
            )}
            {activeWindowMenu === 'removeBook' && (
                <RemoveBookBlock onClose={closeWindow}/>
            )}
            {activeWindowMenu === 'editAuthor' && (
                <EditAuthorBlock onClose={closeWindow}/>
            )}
            {activeWindowMenu === 'editBook' && (
                <EditBookBlock onClose={closeWindow}/>
            )}
            {activeWindowMenu === 'editArticle' && (
                <EditArticleBlock onClose={closeWindow} isAdmin={true}/>    
            )}
            {activeWindowMenu === 'removeArticle' && (
                <RemoveArticleBlock onClose={closeWindow} isAdmin={true}/>    
            )}
            {activeWindowMenu === 'editUserRole' && (
                <EditUserRoleBlock onClose={closeWindow}/>    
            )}
            {activeWindowMenu === 'removeUser' && (
                <RemoveUserBlock onClose={closeWindow}/>    
            )}
        </div>
    )
}

export default AdminMenu;