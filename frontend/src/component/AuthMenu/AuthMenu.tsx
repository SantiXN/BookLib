import React, { useEffect, useRef, useState } from 'react';
import s from './AuthMenu.module.css'
import RegisterMenu from '../RegisterMenu/RegisterMenu';
import PasswordInputField from '../common/PasswordInputField/PasswordInputField';

interface AuthMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const AuthMenu: React.FC<AuthMenuProps> = ({ isOpen, onClose }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isRegisterMenuOpen, setIsRegisterMenuOpen] = useState(false);
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const isDataError = !(password.trim() && login.trim()) || loginError != '' || passwordError != '';

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
        const value = e.target.value;
        setLogin(value);
        if (!isValidEmail(value) && value.length != 0) {
            setLoginError('Некорректный email');
        } else {
            setLoginError('');
        }
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPassword(value);
        if (value.length < 8) {
            setPasswordError('Пароль должен быть не менее 8 символов')
        } else {
            setPasswordError('')
        }
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
                                        placeholder='E-mail'
                                        value={login}
                                        onChange={handleLoginChange}
                                    />
                                </label>
                                {loginError && <p className={s.errorText}>{loginError}</p>}
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
                            <button type="submit" className={`${s.button} ${s.formButton} ${isDataError ? s.disabledButton : ''}`}
                            disabled={isDataError}
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