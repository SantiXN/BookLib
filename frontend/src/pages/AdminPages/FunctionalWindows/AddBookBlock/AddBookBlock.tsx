import React, { useEffect, useRef, useState } from 'react';
import s from '../FunctionalWindow.module.css';

interface BlockProps {
    isOpen: string | null;
    onClose: () => void;
}

const AddBookBlock: React.FC<BlockProps> = ({ isOpen, onClose }) => {
    const [authors, setAuthors] = useState<string[]>(['lol']);
    const containerRef = useRef<HTMLDivElement>(null);
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [description, setDescription] = useState('');
    const [bookFile, setBookFile] = useState<File | null>(null);
    const [bookCover, setBookCover] = useState<File | null>(null);

    const isFormFieldsEmpty = !(title.trim() && description.trim() && author.trim() && bookCover && bookFile);

    const close = () => {
        setTitle('');
        setDescription('');
        setBookCover(null);
        setBookFile(null);
        onClose();
    };
    
    const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
            close();        
        }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            close();
        }
    };

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

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };
    
    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(e.target.value);
    };    

    const handleAuthorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setAuthor(e.target.value);
    }; 

    const handleBookCoverFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedBookCover = event.target.files?.[0];
        if (selectedBookCover) {
            setBookCover(selectedBookCover);
        }
    };

    const handleBookFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedBookFile = event.target.files?.[0];
        if (selectedBookFile) {
            setBookFile(selectedBookFile);
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Title:', title);
        console.log('Description:', description);
        console.log('Book cover file:', bookCover);
        console.log('Book file:', bookFile);
    };

    return (
        <div className={s.container}>
            <div ref={containerRef} className={s.block}>
                <div className={s.menuHeader}>
                    <p className={s.menuTitle}>Добавить книгу</p>
                    <span onClick={onClose} className={s.closeIcon} />
                </div>
                <div className={s.menuContainer}>
                    <form className={s.form} onSubmit={handleSubmit}>
                        <div className={s.formFieldContainer}>
                            <label className={s.formLabel}>
                                Название
                                <input
                                    className={s.input}
                                    id="title"
                                    type="text"
                                    placeholder="Название"
                                    value={title}
                                    onChange={handleTitleChange}
                                />
                            </label>
                        </div>
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
                                Описание
                                <textarea
                                    className={s.formTextArea}
                                    value={description}
                                    onChange={handleDescriptionChange}
                                />
                            </label>
                        </div>
                        <div className={s.formFieldContainer}>
                            <label className={s.formLabel} htmlFor='book-cover'>Изображение</label>
                            <div className={s.customFileContainer}>
                                <input
                                    accept=".jpg,.jpeg,.png"
                                    id="book-cover"
                                    type="file"
                                    className={s.fileInput}
                                    onChange={handleBookCoverFileChange}
                                />
                                <label
                                    htmlFor="book-cover"
                                    className={`${s.customFileLabel}`}
                                >
                                    {bookCover ? bookCover.name : "Выберите файл"}
                                </label>
                            </div>
                        </div>
                        <div className={s.formFieldContainer}>
                            <label className={s.formLabel} htmlFor='book-file'>Книга</label>
                            <div className={s.customFileContainer}>
                                <input
                                    accept=".pdf"
                                    id="book-file"
                                    type="file"
                                    className={s.fileInput}
                                    onChange={handleBookFileChange}
                                />
                                <label
                                    htmlFor="book-file"
                                    className={`${s.customFileLabel}`}
                                >
                                    {bookFile ? bookFile.name : "Выберите файл"}
                                </label>
                            </div>
                        </div>
                        <div className={s.actionButtonContainer}>
                            <button
                                type="submit"
                                className={`${s.button} ${s.formButton} ${isFormFieldsEmpty ? s.disabledButton : ""}`}
                                disabled={isFormFieldsEmpty}
                            >
                                Добавить
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddBookBlock;
