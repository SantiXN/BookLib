import React, { useState } from 'react';
import s from '../FunctionalWindow.module.css'
import useApi from '../../../../../api/ApiClient';
import { CreateAuthorRequest } from '../../../../../api';

interface BlockProps {
    onClose: () => void;
}

const AddAuthorBlock: React.FC<BlockProps> = ({ onClose }) => {
    const { AuthorApi } = useApi();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [description, setDescription] = useState('');

    const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFirstName(e.target.value);
    };

    const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLastName(e.target.value);
    };    
    
    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(e.target.value);
    };    

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!firstName) return;

        setFirstName(firstName.trim());
        setLastName(lastName.trim());
        setDescription(description.trim());

        const request: CreateAuthorRequest = {firstName};
        if (lastName) request.lastName = lastName;
        if (description) request.description = description;

        AuthorApi.createAuthor({ createAuthorRequest: request })
            .then((response) => {
                alert(`Автор успешно добавлен! ID: ${response.id}`);
                onClose();
                setFirstName('');
                setLastName('');
                setDescription('');
            })
            .catch((error) => {
                console.error('Error adding author:', error);
                alert('Не удалось добавить автора. Попробуйте позже.');
            })
    };

    return (
        <div className={s.container}>
            <div className={s.block} style={{width: '600px'}}>
                <div className={s.menuHeader}>
                    <p className={s.menuTitle}>Добавить автора</p>
                    <span onClick={onClose} className={s.closeIcon} />
                </div>
                <div className={s.menuContainer}>
                    <form className={s.form} onSubmit={handleSubmit}>
                        <div className={s.formFieldContainer}>
                            <label className={s.formLabel}>
                                Имя
                                <input
                                    className={s.input}
                                    id='first_name'
                                    type='text'
                                    placeholder='Имя'
                                    value={firstName}
                                    onChange={handleFirstNameChange}
                                />
                            </label>
                        </div>
                        <div className={s.formFieldContainer}>
                            <label className={s.formLabel}>
                                Фамилия
                                <input
                                    className={s.input}
                                    id='last_name'
                                    type='text'
                                    placeholder='Фамилия'
                                    value={lastName}
                                    onChange={handleLastNameChange}
                                />
                            </label>
                        </div>
                        <div className={s.formFieldContainer}>
                            <label className={s.formLabel}>
                                Описание
                                <textarea className={s.formTextArea} 
                                    value={description}
                                    onChange={handleDescriptionChange}
                                />
                            </label>
                        </div>
                        <div className={s.actionButtonContainer}>
                            <button type="submit" className={`${s.button} ${s.formButton} ${!firstName ? s.disabledButton : ''}`}
                                disabled={!firstName}
                                >
                                    Добавить
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AddAuthorBlock;