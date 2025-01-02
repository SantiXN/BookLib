import { useState } from 'react';
import s from './AdminMenuPage.module.css'
import AddAuthorBlock from './FunctionalWindows/AddAuthorBlock/AddAuthorBlock';

const AdminMenu = () => {
    const [activeWindowMenu, setActiveWindowMenu] = useState<string | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleButtonClick = (window: string) => setActiveWindowMenu(window); 

    const closeWindow = () => setActiveWindowMenu(null);

    return (
        <div className={s.adminMenuContainer}>
            <p className={s.title}>Меню администратора</p>
            <div className={s.adminMenuButtons}>
                <div className={s.buttonsContainer}>
                    <button className={s.button} onClick={() => handleButtonClick('addAuthor')}>Добавить автора</button>
                    <button className={s.button} onClick={() => handleButtonClick('addBook')}>Добавить книгу</button>
                    <button className={s.button} onClick={() => handleButtonClick('addUser')}>Добавить пользователя</button>
                    <button className={s.button} onClick={() => handleButtonClick('removeAuthor')}>Удалить автора</button>
                    <button className={s.button} onClick={() => handleButtonClick('removeBook')}>Удалить книгу</button>
                    <button className={s.button} onClick={() => handleButtonClick('removeUser')}>Удалить пользователя</button>
                    <button className={s.button} onClick={() => handleButtonClick('editAuthor')}>Редактировать данные автора</button>
                    <button className={s.button} onClick={() => handleButtonClick('editBook')}>Изменить книгу</button>
                    <button className={s.button} onClick={() => handleButtonClick('editUser')}>Редактировать данные пользователя</button>
                </div>
            </div>

            {activeWindowMenu === "addAuthor" && (
                <AddAuthorBlock isOpen={activeWindowMenu} onClose={closeWindow}/>
            )}
        </div>
    )
}

export default AdminMenu;