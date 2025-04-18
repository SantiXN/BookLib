import { useEffect, useState } from 'react';
import s from './MainPage.module.css';
import BookCard from '../../component/common/BookCard/BookCard';
import useApi from '../../../api/ApiClient';
import { ParsedBookCard } from '../../types/BookTypes';
import { parseBookCardsResponse } from '../../utils/BookUtils';
import LoadingMessage from '../../component/common/LoadingMessage/LoadingMessage';
import ErrorMessage from '../../component/common/ErrorMessage/ErrorMessage';

const MainPage = () => {
    const { BookApi } = useApi();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [fantasyBooks, setFantasyBooks] = useState<ParsedBookCard[]>([]);
    const [detectiveBooks, setDetectiveBooks] = useState<ParsedBookCard[]>([]);
    const [classicBooks, setClassicBooks] = useState<ParsedBookCard[]>([]);

    useEffect(() => {
        const fetchAllBooks = async () => {    
            try {
                const requests = [
                    BookApi.listBooksByCategory({ categoryID: 1 }).then(parseBookCardsResponse),
                    BookApi.listBooksByCategory({ categoryID: 7}).then(parseBookCardsResponse),
                    BookApi.listBooksByCategory({ categoryID: 3 }).then(parseBookCardsResponse),
                ];
    
                const [fantasy, detective, classic] = await Promise.all(requests);
    
                setFantasyBooks(fantasy || []);
                setDetectiveBooks(detective || []);
                setClassicBooks(classic || []);
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
            {classicBooks.length > 0 && (
                <div className={s.bookCardByTheme}>
                    <p className={s.title}>Классика</p>
                    <div className={s.block}>
                        {classicBooks.map((book, index) => (
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
