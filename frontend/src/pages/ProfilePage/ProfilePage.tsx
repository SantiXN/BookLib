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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };
    

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleAvatarChange = () => {
        // Логика для смены аватара
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
                <div className={s.infoContainer}>
                    <div className={s.formContainer}>
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
                                    readOnly
                                />
                            </div>
                            <div className={s.inputWrapper}>
                                <label className={s.label}>
                                    Пароль
                                </label>
                                <input
                                    className={s.input}
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    readOnly
                                />
                                <div onClick={togglePasswordVisibility} className={showPassword ? s.eye : s.eyeClose}></div>
                            </div>
                            <button className={`${s.submitButton} ${s.disabledButton}`} type='submit' disabled={true}>Сохранить изменения</button>
                        </form>
                    </div>
                    <div className={s.logotype}>
                        <img className={s.avatar} alt={formData.firstName} src={formData.avatar} />
                        <button type="button" onClick={handleAvatarChange}>
                            Сменить аватар
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default ProfilePage;
