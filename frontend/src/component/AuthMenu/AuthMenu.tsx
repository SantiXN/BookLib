import React, { useEffect, useRef, useState } from 'react';
import s from './AuthMenu.module.css'
import RegisterMenu from '../RegisterMenu/RegisterMenu';
import PasswordInputField from '../common/PasswordInputField/PasswordInputField';

interface AuthMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

const AuthMenu: React.FC<AuthMenuProps> = ({ isOpen, onClose }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isRegisterMenuOpen, setIsRegisterMenuOpen] = useState(false);
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const isFormFieldsEmpty = !(login.trim() && password.trim());

    const close = () => {
        setLogin('');
        setPassword('');

        onClose();
    }

    const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
            close();
        }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            close();
        }
    };

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

    const openRegisterMenu = () => setIsRegisterMenuOpen(true);
    const closeRegisterMenu = () => setIsRegisterMenuOpen(false);

    const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLogin(e.target.value);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Здесь можно добавить логику для авторизации
        console.log('Логин:', login);
        console.log('Пароль:', password);
    };

    if (!isOpen) return null;

    return (
        <div className={s.container}>
            {!isRegisterMenuOpen ? (
                <div id='auth-menu' className={s.authMenu} ref={containerRef}>
                    <div className={s.menuHeader}>
                        <p className={s.menuTitle}>Войти</p>
                        <span onClick={onClose} className={s.closeIcon} />
                    </div>
                    <div className={s.menuContainer}>
                        <form className={s.form} onSubmit={handleSubmit}>
                            <div className={s.formFieldContainer}>
                                <label className={s.formLabel}>
                                    Логин
                                    <input
                                        id='login'
                                        className={s.formTextInput}
                                        type='text'
                                        placeholder='Логин'
                                        value={login}
                                        onChange={handleLoginChange}
                                    />
                                </label>
                            </div>
                            <div className={s.formFieldContainer}>
                                <label className={s.formLabel}>
                                    Пароль
                                    <PasswordInputField
                                        id='password'
                                        placeholder='Пароль'
                                        value={password}
                                        onChange={handlePasswordChange}
                                    />
                                </label>
                            </div>
                            <button type="submit" className={`${s.button} ${s.formButton} ${isFormFieldsEmpty ? s.disabledButton : ''}`}
                            disabled={isFormFieldsEmpty}
                            >
                                Войти
                            </button>
                        </form>
                        <div className={s.delimDivider}>или</div>
                        <button className={s.button} onClick={openRegisterMenu}>Зарегистрироваться</button>
                    </div>
                </div>
            ) : (
                <RegisterMenu isOpen={isRegisterMenuOpen} onClose={closeRegisterMenu} />
            )}
        </div>
    );
};

export default AuthMenu;