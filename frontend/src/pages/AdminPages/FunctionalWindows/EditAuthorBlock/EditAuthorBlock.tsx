import React, { useEffect, useRef, useState } from 'react';
import s from '../FunctionalWindow.module.css'
import { AuthorInfo, EditAuthorRequest } from '../../../../../api';
import useApi from '../../../../../api/ApiClient';

interface BlockProps {
    isOpen: string | null;
    onClose: () => void;
}

const EditAuthorBlock: React.FC<BlockProps> = ({ isOpen, onClose }) => {
    const { AuthorApi } = useApi();

    // TODO: загрузка файлов 
    const [selectedAuthorId, setSelectedAuthorId] = useState<number | null>(null);
    const [author, setAuthor] = useState<AuthorInfo | null>(null);    

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

    const handleAuthorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const authorID = Number(e.target.value);
        setSelectedAuthorId(authorID);
    }; 

    const handleSearchAuthor = () => {
        if (!selectedAuthorId) return;

        AuthorApi.getAuthorInfo({ authorID: selectedAuthorId })
            .then((response) => {
                if (response.author) {
                    setAuthor(response.author)
                }
            })
            .catch(() => alert('Автора с заданным ID не найден!'));
    }

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

        AuthorApi.editAuthor({ authorID: author!.id, editAuthorRequest: updatedData })
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
                        <div className={`${s.formFieldContainer} ${s.inputContainerFromId}`}>
                            <label className={s.formLabel} htmlFor='authorId'>ID автора</label>
                            <input
                                className={`${s.input} ${s.autoWidth}`}
                                id='authorId'
                                type='number'  
                                value={selectedAuthorId || ''}
                                onChange={(value) => handleAuthorChange(value)}
                            />
                            <button
                                type="button"
                                onClick={handleSearchAuthor}
                                disabled={!selectedAuthorId}
                                className={`${s.button} ${!selectedAuthorId ? s.disabledButton : ''}`}
                            >
                                Поиск
                            </button>
                        </div>
                        {author && (
                            <div>
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
                            </div>
                        )}
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