import React, { useEffect, useRef, useState } from 'react';
import s from '../FunctionalWindow.module.css'
import { AuthorInfo, BookData, BookInfo, CategoryInfo, EditBookOperationRequest, EditBookRequest } from '../../../../../api';
import useApi from '../../../../../api/ApiClient';

interface BlockProps {
    isOpen: string | null;
    onClose: () => void;
}

const EditBookBlock: React.FC<BlockProps> = ({ isOpen, onClose }) => {
    const { BookApi} = useApi();

    const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
    const [selectedBook, setSelectedBook] = useState<BookInfo | null>(null);
    
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [bookCoverFile, setBookCoverFile] = useState<File | null>(null);

    useEffect(() => {
        if (selectedBook) {
            setTitle(selectedBook.title);
            if (selectedBook.description) {
                setDescription(selectedBook.description!);
            }
            // Assuming bookFile and bookCoverFile are URLs or some identifiers in selectedBook
            // TODO
            //setBookFile(selectedBook.bookFile ? new File([], selectedBook.bookFile) : null);
            //setBookCoverFile(selectedBook.bookCoverFile ? new File([], selectedBook.bookCoverFile) : null);
        }
    }, [selectedBook]);    

    const isBookDataChanged = selectedBook 
        ? title !== selectedBook.title ||
          description !== selectedBook.description ||
          bookCoverFile !== null
        : false;

    useEffect(() => {
        // TODO
        // BookApi.listBooks()
        //     .then((response) => {
        //         if (response.books) {
        //             setBooks(response.books);
        //         }
        //         else {
        //             console.error('Ошибка получения списка книг');
        //         }
        //     });
    }, []);

    const close = () => {
        setTitle('');
        setDescription('');
        setBookCoverFile(null);
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

    const handleBookChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const bookId = Number(e.target.value);
        setSelectedBookId(bookId);
    }; 

    const handleBookSearch = () => {
        if (!selectedBookId) return;

        BookApi.getBookInfo({ bookID: selectedBookId })
            .then((response) => {
                if (response.book) {
                    setSelectedBook(response.book);
                }
            })
            .catch(() => alert('Книга с заданным ID не найдена'));
    }

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };
    
    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(e.target.value);
    };    

    const handleBookCoverFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedBookCover = event.target.files?.[0];
        if (selectedBookCover) {
            setBookCoverFile(selectedBookCover);
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!isBookDataChanged) return;

        const request: EditBookRequest = {};
        if (title !== selectedBook?.title) request.newTitle = title;
        if (description !== selectedBook?.description) request.newDescription = description;
        // Book cover

        BookApi.editBook({bookID: selectedBook?.id || 0, editBookRequest: request})
            .then(() => {
                alert('Книга успешно отредактирована');
                close();
            })
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
                        <div className={`${s.formFieldContainer} ${s.inputContainerFromId}`}>
                            <label className={s.formLabel} htmlFor='bookId'>ID книги</label>
                            <input 
                                className={`${s.input} ${s.autoWidth}`}
                                id='bookId'
                                type='number'  
                                value={selectedBookId || ''}
                                onChange={(value) => handleBookChange(value)}
                            />
                            <button
                                type="button"
                                onClick={handleBookSearch}
                                disabled={!selectedBookId}
                                className={`${s.button} ${!selectedBookId ? s.disabledButton : ''}`}
                            >
                                Поиск
                            </button>
                        </div>
                        {selectedBook && (
                            <div>
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
                                            disabled={!selectedBook}
                                        />
                                    </label>
                                </div>
                                <div className={s.formFieldContainer}>
                                    <label className={s.formLabel}>
                                        Описание
                                        <textarea
                                            className={s.formTextArea}
                                            value={description}
                                            onChange={handleDescriptionChange}
                                            disabled={!selectedBook}
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
                                            disabled={!selectedBook}
                                        />
                                        <label
                                            htmlFor="book-cover"
                                            className={`${s.customFileLabel}`}
                                        >
                                            {bookCoverFile ? bookCoverFile.name : "Выберите файл"}
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className={s.actionButtonContainer}>
                            <button
                                type="submit"
                                className={`${s.button} ${s.formButton} ${!isBookDataChanged ? s.disabledButton : ""}`}
                                disabled={!isBookDataChanged}
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