import s from './ProfilePage.module.css'
import React, {useState} from 'react';

const ProfilePage = () => {
    const [formData, setFormData] = useState({
        firstName: 'firstName',
        lastName: 'lastName',
        email: 'email',
        password: 'password',
        avatar: 'src',
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleAvatarChange = () => {
        // Логика для смены аватара
        alert('Смена аватара');
    };

    const handleLogout = () => {
        // Логика для выхода из аккаунта
        alert('Вы вышли из аккаунта');
    };

    return (
        <div className={s.profileCart}>
            <div>
                <div className={s.topBlock}>
                    <h2 className={s.title}>Личная информация</h2>
                    <button type="button" onClick={handleLogout} style={{marginLeft: '10px'}}>
                        Выйти
                    </button>
                </div>
                <form className={s.form}>
                    <div className={s.inputWrapper}>
                        <label className={s.label}>
                            Имя
                        </label>
                        <input
                            className={s.input}
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className={s.inputWrapper}>
                        <label className={s.label}>
                            Фамилия
                        </label>
                        <input
                            className={s.input}
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className={s.inputWrapper}>
                        <label className={s.label}>
                            E-mail
                        </label>
                        <input
                            className={s.input}
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className={s.inputWrapper}>
                        <label className={s.label}>
                            Password
                        </label>
                        <input
                            className={s.input}
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <div onClick={togglePasswordVisibility} className={showPassword ? s.eye : s.eyeClose}></div>
                    </div>

                </form>
                <div className={s.logotype}>
                    <img className={s.avatar} alt={formData.firstName} src={formData.avater}></img>
                    <button type="button" onClick={handleAvatarChange}>
                        Сменить аватар
                    </button>
                </div>
            </div>

        </div>
    );
};

export default ProfilePage;
