import { useEffect, useState, useCallback } from 'react';
import s from './GenrePage.module.css';
import { useParams } from 'react-router-dom';
import { BookApiClient } from '../../../api/ApiClient';
import { ParsedBookCard } from '../../types/BookTypes';
import { parseBookCardsResponse } from '../../utils/BookUtils';

const GenrePage = () => {
    const { genreID } = useParams<{ genreID: string }>();
    const [genre, id] = genreID!.split('-');
    const [books, setBooks] = useState<ParsedBookCard[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const booksInPage = 20;

    const loadBooks = useCallback(async () => {
        setLoading(true);
        try {
            const response = await BookApiClient.listBooksByCategory({ categoryID: Number(id), limit: booksInPage, page: page });
            const newBooks = parseBookCardsResponse(response);
            setBooks((prevBooks) => [...prevBooks, ...newBooks]);
            setHasMore(newBooks.length > 0);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [id, page]);

    useEffect(() => {
        loadBooks();
    }, [loadBooks]);

    const handleLoadMore = () => {
        setPage((prevPage) => prevPage + 1);
    };

    return (
        <div className={s.container}>
            <div className={s.catalogHeader}>
                <p className={s.title}>{genre}</p>
                <div className={s.filteringContainer}></div>
            </div>
            <div className={s.catalog}>
                {books.map((book, index) => (
                    <div className={s.catalogItem} key={index}>
                        <a href={book.toDirect} className={s.catalogItemLink}>
                            <img src={book.coverImage} alt={book.title} className={s.bookCover} />
                            <div className={s.bookInfo}>
                                <p className={s.bookTitle}>{book.title}</p>
                                <p className={s.bookAuthors}>{book.author}</p>
                                <div className={s.bookRatingBlock}>
                                    <div className={s.ratingLogo} />
                                    <p className={s.bookRating}>{book.rating}</p>
                                </div>
                            </div>
                        </a>
                    </div>
                ))}
            </div>
            {loading && <p>Loading...</p>}
            {hasMore && !loading && (
                <div className={s.loadMoreContainer}>
                    <button className={s.loadMoreButton} onClick={handleLoadMore}>
                        Загрузить еще
                    </button>
                </div>
            )}
        </div>
    );
};

export default GenrePage;