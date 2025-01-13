import React, { useEffect, useState } from 'react';
import s from './MainPage.module.css';
import BookCard from '../../component/common/BookCard/BookCard';
import ApiClient from '../../../api/ApiClient';
import { ListBooksByCategoryRequest } from '../../../api/apis/BookApi';
import { ListBooksByCategoryResponseData } from '../../../api/models/ListBooksByCategoryResponseData'

type ParsedBook = {
    title: string;
    author: string;
    coverImage: string;
    rating: number;
    toDirect: string;
};

function parseBooksResponse(response: ListBooksByCategoryResponseData): ParsedBook[] {
    if (!response.books) {
        return []; // Если books нет, возвращаем пустой массив
    }

    return response.books.map((book) => ({
        title: book.title || "Untitled Book",
        author: book.authors?.map((author) => `${author.firstName} ${author.lastName}`).join(", ") || "Unknown Author",
        coverImage: book.coverPath || "default.jpg",
        rating: book.starCount || 0,
        toDirect: `/book/${book.id}`,
    }));
}



const MainPage = () => {
    // TODO: Что делать, если массивы с книгами получаются пустые?
    const [fantasyBooks, setFantasyBooks] = useState<ParsedBook[]>([]);
    const [mysteryBooks, setMysteryBooks] = useState<ParsedBook[]>([]);
    const [detectiveBooks, setDetectiveBooks] = useState<ParsedBook[]>([]);

    useEffect(() => {
        const fantasyBooksRequest: ListBooksByCategoryRequest = { categoryID: 1 };
        ApiClient.listBooksByCategory(fantasyBooksRequest)
            .then((response) => {
                console.log('Get fantasy books');
                if (response && response.books) {
                    setFantasyBooks(parseBooksResponse(response));
                }
            })
            .catch((error) => console.error('Failed to fetch fantasy books:', error));

        const mysteryBooksRequest: ListBooksByCategoryRequest = { categoryID: 2 };
        ApiClient.listBooksByCategory(mysteryBooksRequest)
            .then((response) => {
                if (response && response.books) {
                    setMysteryBooks(parseBooksResponse(response));
                }
                console.log('Get mystery books');
            })
            .catch((error) => console.error('Failed to fetch mystery books:', error));

        const detectiveBooksRequest: ListBooksByCategoryRequest = { categoryID: 3 };
        ApiClient.listBooksByCategory(detectiveBooksRequest)
            .then((response) => {
                if (response && response.books) {
                    setDetectiveBooks(parseBooksResponse(response));
                }
                console.log('Get detective books');
            })
            .catch((error) => console.error('Failed to fetch detective books:', error));
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
