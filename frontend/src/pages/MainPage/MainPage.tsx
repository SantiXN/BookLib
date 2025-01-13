import React, { useEffect, useState } from 'react';
import s from './MainPage.module.css';
import BookCard from '../../component/common/BookCard/BookCard';
import { BookApiClient } from '../../../api/ApiClient';
import { ListBooksByCategoryRequest } from '../../../api/apis/BookApi';
import { ParsedBookCard } from '../../types/BookTypes';
import { parseBookCardsResponse } from '../../utils/BookUtils';

const MainPage = () => {
    // TODO: Что делать, если массивы с книгами получаются пустые?
    const [fantasyBooks, setFantasyBooks] = useState<ParsedBookCard[]>([]);
    const [mysteryBooks, setMysteryBooks] = useState<ParsedBookCard[]>([]);
    const [detectiveBooks, setDetectiveBooks] = useState<ParsedBookCard[]>([]);

    const fetchBooksByCategory = (categoryID: number, setBooks: React.Dispatch<React.SetStateAction<any>>) => {
        const request: ListBooksByCategoryRequest = { categoryID };
        BookApiClient.listBooksByCategory(request)
            .then((response) => {
                if (response && response.books) {
                    setBooks(parseBookCardsResponse(response));
                }
            })
            .catch((error) => console.error(`Failed to fetch books for category ${categoryID}:`, error));
    };

    useEffect(() => {
        fetchBooksByCategory(1, setFantasyBooks);
        fetchBooksByCategory(2, setMysteryBooks);
        fetchBooksByCategory(3, setDetectiveBooks);
    }, []);

    return (
        <div className={s.container}>
            {fantasyBooks.length > 0 && (
                <div className={s.bookCardByTheme}>
                    <p className={s.title}>Фантастика</p>
                    <div className={s.block}>
                        {fantasyBooks.map((book, index) => (
                            <BookCard 
                                key={index}
                                title={book.title} 
                                author={book.author} 
                                coverImage={book.coverImage} 
                                rating={book.rating} 
                                toDirect={book.toDirect}
                                classname={s.mainPageItem}
                            />
                        ))}
                    </div>
                </div>
                )}
            {mysteryBooks.length > 0 && (
                <div className={s.bookCardByTheme}>
                    <p className={s.title}>Мистика</p>
                    <div className={s.block}>
                        {mysteryBooks.map((book, index) => (
                            <BookCard 
                                key={index}
                                title={book.title} 
                                author={book.author} 
                                coverImage={book.coverImage} 
                                rating={book.rating} 
                                toDirect={book.toDirect}
                                classname={s.mainPageItem}
                            />
                        ))}
                    </div>
                </div>
            )}
            {detectiveBooks.length > 0 && (
                <div className={s.bookCardByTheme}>
                    <p className={s.title}>Детективы</p>
                    <div className={s.block}>
                        {detectiveBooks.map((book, index) => (
                            <BookCard 
                                key={index}
                                title={book.title} 
                                author={book.author} 
                                coverImage={book.coverImage} 
                                rating={book.rating} 
                                toDirect={book.toDirect}
                                classname={s.mainPageItem}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MainPage;
