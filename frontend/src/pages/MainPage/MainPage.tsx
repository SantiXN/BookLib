import { useEffect, useState } from 'react';
import s from './MainPage.module.css';
import BookCard from '../../component/common/BookCard/BookCard';
import { BookApiClient } from '../../../api/ApiClient';
import { ParsedBookCard } from '../../types/BookTypes';
import { parseBookCardsResponse } from '../../utils/BookUtils';
import LoadingMessage from '../../component/common/LoadingMessage/LoadingMessage';
import ErrorMessage from '../../component/common/ErrorMessage/ErrorMessage';

const MainPage = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [fantasyBooks, setFantasyBooks] = useState<ParsedBookCard[]>([]);
    const [mysteryBooks, setMysteryBooks] = useState<ParsedBookCard[]>([]);
    const [detectiveBooks, setDetectiveBooks] = useState<ParsedBookCard[]>([]);

    useEffect(() => {
        const fetchAllBooks = async () => {
            setLoading(true);
            setError(null);
    
            try {
                const requests = [
                    BookApiClient.listBooksByCategory({ categoryID: 1 }).then(parseBookCardsResponse),
                    BookApiClient.listBooksByCategory({ categoryID: 2 }).then(parseBookCardsResponse),
                    BookApiClient.listBooksByCategory({ categoryID: 3 }).then(parseBookCardsResponse),
                ];
    
                const [fantasy, mystery, detective] = await Promise.all(requests);
    
                setFantasyBooks(fantasy || []);
                setMysteryBooks(mystery || []);
                setDetectiveBooks(detective || []);
            } catch (error) {
                console.error('Ошибка загрузки данных:', error);
                setError(
                    'Ошибка получения данных. Попробуйте позже, либо попробуйте перезагрузить страницу. Если ошибка не исчезла, обратитесь в поддержку',
                );
            } finally {
                setLoading(false);
            }
        };
    
        fetchAllBooks();
    }, []);

    if (loading) {
        return <LoadingMessage />;
    }

    if (error) {
        return <ErrorMessage message={error} />;
    }

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
