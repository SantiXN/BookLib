import { UserApiClient } from '../../../api/ApiClient';
import { useAuth } from '../../context/AuthContext';
import s from './ProfilePage.module.css'
import React, {useEffect, useState} from 'react';

const ProfilePage = () => {
    const [formData, setFormData] = useState({
        firstName: 'firstName',
        lastName: 'lastName',
        email: 'email',
        avatar: 'src',
    });

    useEffect(() => {
        UserApiClient.getAuthorizedUser()
            .then((response) => {
                if (response.user) {
                    setFormData({
                        firstName: response.user.firstName,
                        lastName: response.user.lastName || '',
                        email: response.user.email,
                        avatar: response.user.avatarPath || ''
                    })
                }
            })
    }, [])

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
    const { logOut: logout } = useAuth();

    const handleLogout = () => {
        
        if (window.confirm('Вы уверены, что хотите выйти из аккаунта?')) {
            logout();
        }
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
                        <div className={s.infoWrapper}>
                            <p className={s.userInfoField}>E-mail:</p>
                            <p className={s.userInfoField}>{formData.email}</p>
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
