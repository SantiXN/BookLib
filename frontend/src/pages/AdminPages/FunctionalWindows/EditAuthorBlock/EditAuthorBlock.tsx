import React, { useEffect, useRef, useState } from 'react';
import s from '../FunctionalWindow.module.css'

interface BlockProps {
    isOpen: string | null;
    onClose: () => void;
}

const EditAuthorBlock: React.FC<BlockProps> = ({ isOpen, onClose }) => {
    const [authors, setAuthors] = useState<string[]>([]) // изменить получение на соответствующую структуру
    const [author, setAuthor] = useState('')    

    // Устанвливать следующие поля данными выбранного автора
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [description, setDescription] = useState('');

    const isAuthorDataChanged = false; // сверять firstName, lastName, description с полями выбранного автора 

    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchAuthors = async () => {
            try {
                const response = await fetch('https://api.example.com/options');
                if (!response.ok) {
                    throw new Error('Ошибка загрузки данных');
                }
                const data: string[] = await response.json();
                setAuthors(data);
            } catch (err) {
                //setError(err.message || 'Неизвестная ошибка');
            } finally {
                //setLoading(false);
            }
        };

        fetchAuthors();
    }, []);    
    
    const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
            console.log('click');
            onClose();        
        }
    };
    const handleEscapeKey = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            onClose();
        }
    };

    const handleAuthorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setAuthor(e.target.value);
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
    };  
        
    return (
        <div className={s.container}>
            <div ref={containerRef} className={s.block}>
                <div className={s.menuHeader}>
                    <p className={s.menuTitle}>Редактировать данные автора</p>
                    <span onClick={onClose} className={s.closeIcon} />
                </div>
                <div className={s.menuContainer}>
                    <form className={s.form} onSubmit={handleSubmit}>
                        <div className={s.formFieldContainer}>
                            <label className={s.formLabel} htmlFor='author'>Автор</label>
                            <select id="author" className={s.input} value={author} onChange={handleAuthorChange}>
                                <option value='' disabled>Выберите...</option>
                                {authors.map((author, index) => (
                                    <option key={index} value={author}>
                                        {author}
                                    </option>
                                ))}
                            </select>
                        </div>
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
                            <button
                                type="submit"
                                className={`${s.button} ${s.formButton} ${isAuthorDataChanged ? s.disabledButton : ""}`}
                                disabled={isAuthorDataChanged}
                            >
                                Изменить
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default EditAuthorBlock;