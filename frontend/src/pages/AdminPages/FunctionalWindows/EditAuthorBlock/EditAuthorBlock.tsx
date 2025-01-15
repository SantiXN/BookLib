import React, { useEffect, useRef, useState } from 'react';
import s from '../FunctionalWindow.module.css'
import { AuthorData, EditAuthorRequest } from '../../../../../api';
import { AuthorApiClient } from '../../../../../api/ApiClient';

interface BlockProps {
    isOpen: string | null;
    onClose: () => void;
}

const EditAuthorBlock: React.FC<BlockProps> = ({ isOpen, onClose }) => {
    // TODO: загрузка файлов 
    const [authors, setAuthors] = useState<AuthorData[]>([])
    const [author, setAuthor] = useState<AuthorData | null>(null);    

    const [firstName, setFirstName] = useState(author ? author.firstName : '');
    const [lastName, setLastName] = useState(author ? author.lastName : '');
    const [description, setDescription] = useState(author ? author.description : '');

    useEffect(() => {
        if (author) {
            setFirstName(author.firstName);
            setLastName(author.lastName);
            setDescription(author.description);
        }
    }, [author]);

    const isAuthorDataChanged = author 
        ? (firstName !== author.firstName || lastName !== author.lastName || description !== author.description) 
        : false;

    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        AuthorApiClient.listAuthors()
            .then((response) => {
                if (response.authors) {
                    setAuthors(response.authors);
                }
                else {
                    console.error('Ошибка получения списка авторов');
                }
            });
    }, []);    
    
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

    const handleAuthorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedAuthor = authors.find(a => a.id === Number(e.target.value)) || null;
        setAuthor(selectedAuthor);
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
        console.log(isAuthorDataChanged)
        if (!isAuthorDataChanged) return;

        const updatedData: EditAuthorRequest = {};

        if (firstName !== author!.firstName) updatedData.newFirstName = firstName;
        if (lastName !== author!.lastName) updatedData.newLastName = lastName;
        if (description !== author!.description) updatedData.newDescription = description;

        AuthorApiClient.editAuthor({ authorID: author!.id, editAuthorRequest: updatedData })
            .then(() => {
                alert('Данные автора успешно обновлены!');
                onClose();
            })
            .catch((error) => {
                console.error('Error updating author:', error);
            });
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
                            <select id="author" className={s.input} value={author?.id || ''} onChange={handleAuthorChange}>
                                <option value='' disabled>Выберите...</option>
                                {authors.map((author, index) => (
                                    <option key={index} value={author.id}>
                                        {author.firstName} {author.lastName}
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
                                    disabled={!author}
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
                                    disabled={!author}
                                />
                            </label>
                        </div>
                        <div className={s.formFieldContainer}>
                            <label className={s.formLabel}>
                                Описание
                                <textarea className={s.formTextArea} 
                                    value={description}
                                    onChange={handleDescriptionChange}
                                    disabled={!author}
                                />
                            </label>
                        </div>
                        <div className={s.actionButtonContainer}>
                            <button
                                type="submit"
                                className={`${s.button} ${s.formButton} ${!isAuthorDataChanged ? s.disabledButton : ""}`}
                                disabled={!isAuthorDataChanged}
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