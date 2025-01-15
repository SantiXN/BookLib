import React, { useEffect, useRef, useState } from 'react';
import s from '../FunctionalWindow.module.css'
import { BookData } from '../../../../../api';
import { BookApiClient } from '../../../../../api/ApiClient';

interface BlockProps {
    isOpen: string | null;
    onClose: () => void;
}

const RemoveBookBlock: React.FC<BlockProps> = ({ isOpen, onClose }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const [books, setBooks] = useState<BookData[]>([]);
    const [selectedBookID, setSelectedBookID] = useState<number | null>(null);

    useEffect(() => {
        BookApiClient.listBooks()
            .then((response) => {
                if (response.books) {
                    setBooks(response.books);
                } else {
                    console.error('Error fetching books');
                }
            })
            .catch((error) => {
                console.error(error);
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
        const bookId = Number(e.target.value);
        setSelectedBookID(bookId);
    }; 

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!selectedBookID || !books.some(book => book.id === selectedBookID)) return;

        const confirmDelete = window.confirm('Вы уверены, что хотите удалить эту книгу? Это действие необратимо.');
        if (!confirmDelete) return;

        BookApiClient.deleteBook({bookID: selectedBookID})
            .then(() => {
                alert('Автор успешно удален');
                onClose();
            })
            .catch((error) => {
                console.error(error);
            });
    };    
        
    return (
        <div className={s.container}>
            <div ref={containerRef} className={s.block}>
                <div className={s.menuHeader}>
                    <p className={s.menuTitle}>Удалить книгу</p>
                    <span onClick={onClose} className={s.closeIcon} />
                </div>
                <div className={s.menuContainer}>
                    <form className={s.form} onSubmit={handleSubmit}>
                        <div className={s.formFieldContainer}>
                            <label className={s.formLabel} htmlFor='book'>Книга</label>
                            <select id="book" className={s.input} value={selectedBookID || ''} onChange={handleBookChange}>
                                <option value='' disabled>Выберите...</option>
                                {books.map((book, index) => (
                                    <option key={index} value={book.id}>
                                        {book.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className={s.actionButtonContainer}>
                            <button
                                type="submit"
                                className={`${s.button} ${s.formButton} ${!selectedBookID ? s.disabledButton : ""}`}
                                disabled={!selectedBookID}
                            >
                                Удалить
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default RemoveBookBlock;