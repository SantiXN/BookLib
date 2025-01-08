import { useState } from 'react';
import s from './AdminMenu.module.css'
import AddAuthorBlock from '../FunctionalWindows/AddAuthorBlock/AddAuthorBlock';
import AddBookBlock from '../FunctionalWindows/AddBookBlock/AddBookBlock';
import RemoveAuthorBlock from '../FunctionalWindows/RemoveAuthorBlock/RemoveAuthorBlock';
import RemoveBookBlock from '../FunctionalWindows/RemoveBookBlock/RemoveBookBlock';
import EditAuthorBlock from '../FunctionalWindows/EditAuthorBlock/EditAuthorBlock';
import EditBookBlock from '../FunctionalWindows/EditBookBlock/EditBookBlock';

const AdminMenu = () => {
    const [activeWindowMenu, setActiveWindowMenu] = useState<string | null>(null);

    const handleButtonClick = (window: string) => setActiveWindowMenu(window); 

    const closeWindow = () => setActiveWindowMenu(null);

    // <button className={s.button} onClick={() => handleButtonClick('editUser')}>Редактировать данные пользователя</button>
    // <button className={s.button} onClick={() => handleButtonClick('removeUser')}>Удалить пользователя</button>
    // <button className={s.button} onClick={() => handleButtonClick('addUser')}>Добавить пользователя</button>
    
    return (
        <div className={s.adminMenuContainer}>
            <p className={s.title}>Меню администратора</p>
            <div className={s.adminMenuButtons}>
                <div className={s.buttonsContainer}>
                    <button className={s.button} onClick={() => handleButtonClick('addAuthor')}>Добавить автора</button>
                    <button className={s.button} onClick={() => handleButtonClick('editAuthor')}>Редактировать данные автора</button>
                    <button className={s.button} onClick={() => handleButtonClick('removeAuthor')}>Удалить автора</button>
                    <button className={s.button} onClick={() => handleButtonClick('addBook')}>Добавить книгу</button>
                    <button className={s.button} onClick={() => handleButtonClick('editBook')}>Редактировать книгу</button>                    
                    <button className={s.button} onClick={() => handleButtonClick('removeBook')}>Удалить книгу</button>
                </div>
            </div>

            {activeWindowMenu === 'addAuthor' && (
                <AddAuthorBlock isOpen={activeWindowMenu} onClose={closeWindow}/>
            )}
            {activeWindowMenu === 'addBook' && (
                <AddBookBlock isOpen={activeWindowMenu} onClose={closeWindow}/>
            )}
            {activeWindowMenu === 'removeAuthor' && (
                <RemoveAuthorBlock isOpen={activeWindowMenu} onClose={closeWindow}/>
            )}
            {activeWindowMenu === 'removeBook' && (
                <RemoveBookBlock isOpen={activeWindowMenu} onClose={closeWindow}/>
            )}
            {activeWindowMenu === 'editAuthor' && (
                <EditAuthorBlock isOpen={activeWindowMenu} onClose={closeWindow}/>
            )}
            {activeWindowMenu === 'editBook' && (
                <EditBookBlock isOpen={activeWindowMenu} onClose={closeWindow}/>
            )}
        </div>
    )
}

export default AdminMenu;