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

    const fetchBooksByCategory = (categoryID: number, setBooks: React.Dispatch<React.SetStateAction<any>>) => {
        const request: ListBooksByCategoryRequest = { categoryID };
        ApiClient.listBooksByCategory(request)
            .then((response) => {
                if (response && response.books) {
                    setBooks(parseBooksResponse(response));
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
