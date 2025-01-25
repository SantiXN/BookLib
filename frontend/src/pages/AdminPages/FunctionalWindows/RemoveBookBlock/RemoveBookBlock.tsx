import React, { useState } from 'react';
import s from '../FunctionalWindow.module.css'
import { BookData } from '../../../../../api';
import useApi from '../../../../../api/ApiClient';

interface BlockProps {
    onClose: () => void;
}

const RemoveBookBlock: React.FC<BlockProps> = ({ onClose }) => {
    const { BookApi } = useApi();

    const [bookData, setBookData] = useState<BookData | null>(null);

    const [selectedBookID, setSelectedBookID] = useState<number | null>(null);

    const handleBookChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const bookId = Number(e.target.value);
        setSelectedBookID(bookId);
    }; 

    const handleBookSearch = () => {
        if (!selectedBookID) return;

        BookApi.getBookInfo({ bookID: selectedBookID })
            .then((response) => {
                if (response.book) {
                    setBookData(response.book);
                }
            })
            .catch(() => alert('Книга с заданным ID не найдена'));
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!selectedBookID || !bookData) return;

        const confirmDelete = window.confirm('Вы уверены, что хотите удалить эту книгу? Это действие необратимо.');
        if (!confirmDelete) return;

        BookApi.deleteBook({bookID: selectedBookID})
            .then(() => {
                alert('Книга успешно удалена');
                onClose();
            })
            .catch((error) => {
                console.error(error);
            });
    };    
        
    return (
        <div className={s.container}>
            <div className={s.block}>
                <div className={s.menuHeader}>
                    <p className={s.menuTitle}>Удалить книгу</p>
                    <span onClick={onClose} className={s.closeIcon} />
                </div>
                <div className={s.menuContainer}>
                    <form className={s.form} onSubmit={handleSubmit}>
                        <div className={`${s.formFieldContainer} ${s.inputContainerFromId}`}>
                            <label className={s.formLabel} htmlFor='bookId'>Книга</label>
                            <input 
                                className={`${s.input} ${s.autoWidth}`}
                                id='bookId'
                                type='number'  
                                value={selectedBookID || ''}
                                onChange={(value) => handleBookChange(value)}
                            />
                            <button
                                type="button"
                                onClick={handleBookSearch}
                                disabled={!selectedBookID}
                                className={`${s.button} ${!selectedBookID ? s.disabledButton : ''}`}
                            >
                                Поиск
                            </button>
                        </div>
                        {bookData && (
                            <div>
                                <a href={`/book/${selectedBookID}`} target='_blank'><p>{bookData.title}</p></a>
                            </div>
                        )}
                        <div className={s.actionButtonContainer}>
                            <button
                                type="submit"
                                className={`${s.button} ${s.formButton} ${!bookData ? s.disabledButton : ""}`}
                                disabled={!bookData}
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