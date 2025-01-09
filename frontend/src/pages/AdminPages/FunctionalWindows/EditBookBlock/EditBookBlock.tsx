import React, { useEffect, useRef, useState } from 'react';
import s from '../FunctionalWindow.module.css'

interface BlockProps {
    isOpen: string | null;
    onClose: () => void;
}

const EditBookBlock: React.FC<BlockProps> = ({ isOpen, onClose }) => {
    const [authors, setAuthors] = useState<string[]>([]);
    const [books, setBooks] = useState<string[]>([]);
    const [book, setBook] = useState('');
    
    // Изменение полей должно происходить по выбранной книге
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [description, setDescription] = useState('');
    const [bookFile, setBookFile] = useState<File | null>(null);
    const [bookCoverFile, setBookCoverFile] = useState<File | null>(null);

    const isBookDataChanged = false; // изменять, если изменились поля

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

        const fetchbooks = async () => {
            try {
                const response = await fetch('https://api.example.com/options');
                if (!response.ok) {
                    throw new Error('Ошибка загрузки данных');
                }
                const data: string[] = await response.json();
                setBooks(data);
            } catch (err) {
                //setError(err.message || 'Неизвестная ошибка');
            } finally {
                //setLoading(false);
            }
        };

        fetchbooks();
        fetchAuthors();
    }, []);

    const close = () => {
        setTitle('');
        setAuthor('');
        setDescription('');
        setBookCoverFile(null);
        setBookFile(null);
        onClose();
    };

    const containerRef = useRef<HTMLDivElement>(null);
    
    const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
            console.log('click');
            close();        
        }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            close();
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

    const handleBookChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setBook(e.target.value);
    }; 

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
            setBookCoverFile(selectedBookCover);
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
        console.log('Book cover file:', bookCoverFile);
        console.log('Book file:', bookFile);
    };
        
    return (
        <div className={s.container}>
            <div ref={containerRef} className={s.block}>
                <div className={s.menuHeader}>
                    <p className={s.menuTitle}>Редактировать книгу</p>
                    <span onClick={onClose} className={s.closeIcon} />
                </div>
                <div className={s.menuContainer}>
                    <form className={s.form} onSubmit={handleSubmit}>
                        <div className={s.formFieldContainer}>
                            <label className={s.formLabel} htmlFor='book'>Книга</label>
                            <select id="book" className={s.input} value={book} onChange={handleBookChange}>
                                <option value='' disabled>Выберите...</option>
                                {books.map((book, index) => (
                                    <option key={index} value={book}>
                                        {book}
                                    </option>
                                ))}
                            </select>
                        </div>
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
                                    {bookCoverFile ? bookCoverFile.name : "Выберите файл"}
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
                                className={`${s.button} ${s.formButton} ${isBookDataChanged ? s.disabledButton : ""}`}
                                disabled={isBookDataChanged}
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

export default EditBookBlock;