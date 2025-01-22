import React, {  useRef, useState } from 'react';
import s from './AuthMenu.module.css'
import RegisterMenu from '../RegisterMenu/RegisterMenu';
import PasswordInputField from '../common/PasswordInputField/PasswordInputField';
import useApi from '../../../api/ApiClient';
import { useAuth } from '../../context/AuthContext';

const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const AuthMenu = () => {
    const { UserApi } = useApi();

    const { logIn } = useAuth();
    const containerRef = useRef<HTMLDivElement>(null);
    const [isRegisterMenuOpen, setIsRegisterMenuOpen] = useState(false);
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const isDataError = !(password.trim() && login.trim()) || loginError != '' || passwordError != '';

    const [responseError, setResponseError] = useState('');

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
        setResponseError('');

        console.log(localStorage.getItem('token'))
        UserApi.loginUser({loginUserRequest: {login: login, password: password}})
            .then((response) => {
                if (response) {
                    const token = response.token;
                    logIn(token);
                    setResponseError(''); 
                }
            })
            .catch((err) => {
                console.error(err);
                setResponseError(`Ошибка авторизации: ${err}`); 
            });
    };

    return (
        <div className={s.container}>
            {!isRegisterMenuOpen ? (
                <div id='auth-menu' className={s.authMenu} ref={containerRef}>
                    <div className={s.menuHeader}>
                        <p className={s.menuTitle}>Войти</p>
                    </div>
                    <div className={s.menuContainer}>
                        <form className={s.form} onSubmit={handleSubmit}>
                            <div className={s.formFieldContainer}>
                                <label className={s.formLabel}>
                                    E-mail
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
                            {responseError && (<p>Ошибка авторизации. Данные некорректны</p>)}
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