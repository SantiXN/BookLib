import React, { useEffect, useRef, useState } from 'react';
import s from './AuthMenu.module.css'

interface AuthMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

const AuthMenu: React.FC<AuthMenuProps> = ({ isOpen, onClose }) => {

    const containerRef = useRef<HTMLDivElement>(null);

    const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
            onClose();
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    if (!isOpen) return null;

    // Добавить показ пароля и смену иконки

    return (
        <div className={s.container}>
            <div className={s.authMenu} ref={containerRef}>
                <div className={s.menuHeader}>
                    <p className={s.menuTitle}>Войти</p>
                    <span onClick={onClose} className={s.closeIcon} />
                </div>
                <div className={s.menuContainer}>
                    <form className={s.form}>
                        <p className={s.formSubtitle}>Логин</p>
                        <input id='login' className={s.formTextInput} type='text' placeholder='Логин'></input>
                        <div className={s.passwordDiv}>
                            <p className={s.formSubtitle}>Пароль</p>
                            <input id='password' className={`${s.formTextInput} ${s.passwordInput}`} type='password' placeholder='Пароль'></input>
                            <span className={s.viewPasswordIcon} />
                        </div>
                        <button className={`${s.button} ${s.formButton}`}>Войти</button>
                    </form>
                    <div className={s.delimDivider}>или</div>
                    <button className={s.button}>Зарегистрироваться</button>
                </div>
            </div>
        </div>
    )
}

export default AuthMenu;