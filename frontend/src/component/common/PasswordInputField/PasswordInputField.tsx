import React, { useState, useEffect } from 'react';
import s from './PasswordInputFIeld.module.css';

interface PasswordInputFieldProps {
    id: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const minPasswordLength = 8;

const PasswordInputField: React.FC<PasswordInputFieldProps> = ({ id, placeholder, value, onChange, error = false }) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const changePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    return (
        <div className={s.passwordInputDiv}>
            <input
                id={id}
                className={`${s.input} ${error ? s.error : ''}`}
                type={isPasswordVisible ? 'text' : 'password'}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                minLength={minPasswordLength}
            />
            <span className={`${s.viewPasswordIcon} ${isPasswordVisible ? s.passwordIconVisible : s.passwordIconHidden}`} onClick={changePasswordVisibility} />
        </div>
    );
};

export default PasswordInputField;