import React, { useEffect, useRef, useState } from 'react';
import s from './RegisterMenu.module.css';
import PasswordInputField from '../common/PasswordInputField/PasswordInputField';
import { UserApiClient } from '../../../api/ApiClient';
import { RegisterUserRequest } from '../../../api';

interface RegisterMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

const RegisterMenu: React.FC<RegisterMenuProps> = ({ isOpen, onClose }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        repeatPassword: '',
    });

    const [errors, setErrors] = useState({
        email: '',
        password: '',
        repeatPassword: '',
        firstname: '',
        lastname: '',
    });

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
            onClose();
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [id]: value,
        }));

        // Удаление ошибки при совпадении паролей
        if (id === 'password' || id === 'repeatPassword') {
            if (formData.password === formData.repeatPassword) {
                setErrors(prevState => ({
                    ...prevState,
                    password: '',
                    repeatPassword: '',
                }));
            }
        } else {
            setErrors(prevState => ({
                ...prevState,
                [id]: '',
            }));
        }
    };

    const validateForm = () => {
        let valid = true;
        const newErrors = {
            firstname: '',
            lastname: '',
            email: '',
            password: '',
            repeatPassword: '',
        };

        // Проверка имени
        if (!formData.firstname) {
            newErrors.firstname = 'Имя обязательно';
            valid = false;
        }

        // Проверка email с регулярным выражением
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email || !emailRegex.test(formData.email)) {
            newErrors.email = 'Введите корректный E-mail';
            valid = false;
        }

        // Проверка пароля
        if (!formData.password) {
            newErrors.password = 'Пароль обязателен';
            valid = false;
        }

        // Проверка повторного пароля
        if (formData.repeatPassword !== formData.password) {
            newErrors.repeatPassword = 'Пароли не совпадают';
            valid = false;
        }

        setErrors(newErrors);
        
        return valid;
    };

    useEffect(() => {
        validateForm();
    }, [errors])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (validateForm()) {
            const request: RegisterUserRequest = {
                firstName: formData.firstname,
                email: formData.email,
                password: formData.password,
                ...(formData.lastname && { lastName: formData.lastname }),
            };
            console.log('Данные формы:', formData);
            await UserApiClient.registerUser({ registerUserRequest: request })
                .then(() => {
                    alert('Пользователь создан!');
                    onClose(); // Закрыть меню после успешной регистрации
                })
                .catch((error) => {
                    alert('Ошибка регистрации: ' + (error.message || 'Попробуйте снова позже.'));
                });
        }
    };

    if (!isOpen) return null;

    const isButtonDisabled =
      !formData.firstname ||
      !formData.email ||
      !formData.password ||
      !formData.repeatPassword ||
      !!errors.email ||
      !!errors.password ||
      !!errors.repeatPassword;

    return (
        <div className={s.registerMenu} ref={containerRef}>
            <div className={s.registerMenuHeader}>
                <span className={s.registerMenuBackButton} onClick={onClose} />
                <p className={s.menuTitle}>Регистрация</p>
            </div>
            <div className={s.formContainer}>
                <form className={s.form} onSubmit={handleSubmit}>
                    <div className={s.formFieldContainer}>
                        <label className={s.formLabel}>
                            Имя:
                            <input id='firstname' className={s.formTextInput} type='text' placeholder='Имя' value={formData.firstname} onChange={handleChange} />
                        </label>
                        {errors.firstname && <p className={s.error}>{errors.firstname}</p>}
                    </div>
                    <div className={s.formFieldContainer}>
                        <label className={s.formLabel}>
                            Фамилия:
                            <input id='lastname' className={s.formTextInput} type='text' placeholder='Фамилия' value={formData.lastname} onChange={handleChange} />
                        </label>
                        {errors.lastname && <p className={s.error}>{errors.lastname}</p>}
                    </div>
                    <div className={s.formFieldContainer}>
                        <label className={s.formLabel}>
                            E-mail:
                            <input id='email' className={s.formTextInput} type='text' placeholder='E-mail' value={formData.email} onChange={handleChange} />
                        </label>
                        {errors.email && <p className={s.error}>{errors.email}</p>}
                    </div>
                    <div className={s.formFieldContainer}>
                        <label className={s.formLabel}>
                            Пароль:
                            <PasswordInputField id='password' placeholder='Пароль' value={formData.password} onChange={handleChange} />
                        </label>
                        {errors.password && <p className={s.error}>{errors.password}</p>}
                    </div>
                    <div className={s.formFieldContainer}>
                        <label className={s.formLabel}>
                            Повторите пароль:
                            <PasswordInputField id='repeatPassword' placeholder='Повторите пароль' value={formData.repeatPassword} onChange={handleChange} />
                        </label>
                        {errors.repeatPassword && <p className={s.error}>{errors.repeatPassword}</p>}
                    </div>
                    <div className={s.registerButtonContainer}>
                        <button type="submit" className={`${s.registerButton} ${isButtonDisabled ? s.disabledButton : ''}`} disabled={isButtonDisabled}>Зарегистрироваться</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterMenu;