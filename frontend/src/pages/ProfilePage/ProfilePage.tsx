import { Link, useNavigate } from 'react-router-dom';
import { EditUserInfoRequest } from '../../../api';
import useApi from '../../../api/ApiClient';
import { useAuth } from '../../context/AuthContext';
import s from './ProfilePage.module.css'
import React, {useEffect, useState} from 'react';
import { FaTrash } from 'react-icons/fa';

const ProfilePage = () => {
    const { UserApi, FileApi } = useApi();
    const { isAuthenticated, logOut } = useAuth();
    const navigate = useNavigate();

    const [userRole, setUserRole] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        firstName: 'firstName',
        lastName: 'lastName',
        email: 'email',
        avatarPath: 'src',
    });
    
    const [newData, setNewData] = useState({
        firstName: '',
        lastName: '',
        avatarPath: '',
    });

    const [preview, setPreview] = useState<string | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const isDataChanged = newData.firstName != formData.firstName || newData.lastName != formData.lastName;

    useEffect(() => {
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            avatarPath: '',
        });
    
        setNewData({
            firstName: '',
            lastName: '',
            avatarPath: '',
        });
    
        if (isAuthenticated) {
            UserApi.getAuthorizedUser()
                    .then((response) => {
                        if (response.user) {
                            setFormData({
                                firstName: response.user.firstName,
                                lastName: response.user.lastName || '',
                                email: response.user.email,
                                avatarPath: response.user.avatarPath || '',
                            });
                            setUserRole(response.user.role || '');
                            setNewData({
                                firstName: response.user.firstName,
                                lastName: response.user.lastName || '',
                                avatarPath: response.user.avatarPath || '',
                            });
                        }
                    })
                    .catch((err) => {
                        console.error('Ошибка при получении данных пользователя:', err);
                    });
        } else {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);  

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setNewData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!isDataChanged) return;

        const request: EditUserInfoRequest = {};
        if (newData.firstName && newData.firstName !== formData.firstName) {
            request.firstName = newData.firstName;
        }
        if (newData.lastName && newData.lastName !== formData.lastName) {
            request.lastName = newData.lastName;
        }
        if (newData.avatarPath && newData.avatarPath !== formData.avatarPath) {
            request.avatarPath = newData.avatarPath;
        }


        UserApi.editUserInfo({ editUserInfoRequest: request})
            .then(() => {
                navigate(0);
            })
            .catch((err) => console.error(err));
    }

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
            setAvatarFile(file);
        }
    };

    const saveAvatar = async () => {
        if (!avatarFile) return;

        try {
            setIsUploading(true);

            const formData = new FormData();
            formData.append('file', avatarFile);

            const uploadResponse = await FileApi.uploadFile({ file: avatarFile });

            if (uploadResponse.filePath) {
                setFormData(prevData => ({
                    ...prevData,
                    avatarPath: "http://localhost:8080" + uploadResponse.filePath,
                }));

                const editUserInfoRequest: EditUserInfoRequest = {
                    avatarPath: "http://localhost:8080" + uploadResponse.filePath,
                };

                const editResponse = await UserApi.editUserInfo({ editUserInfoRequest });
                console.log('Edit user info response:', editResponse);
                navigate(0);
            } else {
                alert('Не удалось загрузить аватар. Пожалуйста, попробуйте еще раз.');
            }
        } catch (error: any) {
            console.error('Ошибка при загрузке аватара:', error);
            alert('Не удалось загрузить аватар. Пожалуйста, попробуйте еще раз.');
        } finally {
            setIsUploading(false);
        }
    };

    const removeAvatarHandle = () => {
        setPreview(null);
        setAvatarFile(null);
    }

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
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        {userRole && userRole == 'admin' && (
                            <Link to={'/admin'} style={{marginRight: '10px'}}>
                                <button>
                                    Меню администратора
                                </button>
                            </Link>
                        )}
                        {userRole && userRole != '' && userRole != 'user' && (
                            <Link to={'/editor'} style={{marginRight: '10px'}}>
                                <button>
                                    Меню редактора
                                </button>
                            </Link>
                        )}
                        <button type="button" onClick={handleLogout}>
                            Выйти
                        </button>
                    </div>
                </div>
                <div className={s.infoContainer}>
                    <div className={s.formContainer}>
                        <div className={s.infoWrapper}>
                            <p className={s.userInfoField}>E-mail:</p>
                            <p className={s.userInfoField}>{formData.email}</p>
                        </div>
                        <form className={s.form} onSubmit={handleSubmit}>
                            <div className={s.inputWrapper}>
                                <label className={s.label}>
                                    Имя
                                </label>
                                <input
                                    className={s.input}
                                    type="text"
                                    name="firstName"
                                    value={newData.firstName}
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
                                    value={newData.lastName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <button
                                className={`${s.submitButton} ${!isDataChanged && s.disabledButton}`}
                                type='submit'
                                disabled={!isDataChanged}
                            >
                                Сохранить изменения
                            </button>
                        </form>
                    </div>
                    <div className={s.logotype}>
                        <img className={s.avatar} alt={formData.firstName} src={preview || formData.avatarPath} />
                        <input
                            type="file"
                            accept="image/jpeg, image/png, image/webp"
                            onChange={handleAvatarChange}
                            style={{ display: 'none' }}
                            id="avatar-upload"
                        />
                        <div style={{ display: 'flex', margin: '10px 0', alignItems: 'center' }}>
                            <label htmlFor="avatar-upload" className={s.avatarLabel} style={avatarFile ? { display: 'none' } : {}}>
                                Сменить аватар
                            </label>
                            <button
                                style={!avatarFile ? { display: 'none' } : {}}
                                className={s.avatarLabel}
                                disabled={isUploading || !avatarFile}
                                onClick={saveAvatar}
                            >
                                {isUploading ? 'Загрузка...' : 'Сохранить аватар'}
                            </button>
                            {avatarFile && (
                                <FaTrash size={20} color='2441C1' style={{ cursor: 'pointer', marginLeft: '10px' }} onClick={removeAvatarHandle} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;