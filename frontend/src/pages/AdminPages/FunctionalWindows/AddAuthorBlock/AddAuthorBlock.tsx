import React, { useEffect, useRef, useState } from 'react';
import s from '../FunctionalWindow.module.css'
import { AuthorApiClient } from '../../../../../api/ApiClient';
import { CreateAuthorRequest } from '../../../../../api';

interface BlockProps {
    isOpen: string | null;
    onClose: () => void;
}

const AddAuthorBlock: React.FC<BlockProps> = ({ isOpen, onClose }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [description, setDescription] = useState('');
    
    const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
            onClose();        
        }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            onClose();
        }
    };

    useEffect(() => {
        if (isOpen != null) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleEscapeKey);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [isOpen]);

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

        AuthorApiClient.createAuthor({ createAuthorRequest: request })
            .then(() => {
                alert('Автор успешно добавлен!');
                onClose();
            })
            .catch((error) => {
                console.error('Error while adding author:', error);
                alert('Не удалось добавить автора. Попробуйте позже.');
            })
            .finally(() => {
                setFirstName('');
                setLastName('');
                setDescription('');
            });
    };

    return (
        <div className={s.container}>
            <div ref={containerRef} className={s.block}>
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