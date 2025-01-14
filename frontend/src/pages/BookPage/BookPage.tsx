import { useEffect, useState } from 'react';
import BookReviews from '../../component/common/BookReviews/BookReviews';
import s from './BookPage.module.css'
import { BookApiClient } from '../../../api/ApiClient';
import { GetBookInfoRequest } from '../../../api';
import { useParams } from 'react-router-dom';
import { ParsedBookInfo } from '../../types/BookTypes';
import { parseAuthorInfoInBookResponse } from '../../utils/AuthorUtils';
import { parseBookInfoResponse } from '../../utils/BookUtils';
import { ParsedAuthorInfo } from '../../types/AuthorTypes';
import { parseFeedbacksInBookResponse } from '../../utils/FeedbackUtils';
import { ParsedFeedbackInfo } from '../../types/FeedbackTypes';
import ErrorMessage from '../../component/common/ErrorMessage/ErrorMessage';
import LoadingMessage from '../../component/common/LoadingMessage/LoadingMessage';

const BookPage = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // TODO: добавить проверку на авторизацию, чтобы выполнять действия

    // TODO: добавление проверять через список книг, находящихся в библиотеке пользователя
    const [isAddedToRead, setIsAddedToRead] = useState(false);
    const changeBookToReadStateHandleClick = ({ isAdded }: { isAdded: boolean }) => {
        BookApiClient.addBookToLibrary({ bookID: curBookId })
            .catch((err) => {
                console.error('Не удалось добавить книгу в библиотеку: ', err);
            });
        setIsAddedToRead(isAdded); 
    };

    const [bookInfo, setBookInfo] = useState<ParsedBookInfo | null>(null);
    const [authorInfo, setAuthorInfo] = useState<ParsedAuthorInfo[]>([]);
    const [feedbackInfo, setFeedbackInfo] = useState<ParsedFeedbackInfo[]>([]);

    const { id } = useParams<{ id: string }>();
    const curBookId = id ? Number(id) : 0;

    useEffect(() => {
        BookApiClient.getBookInfo({ bookID: curBookId})
            .then((response) => {
                setBookInfo(parseBookInfoResponse(response));
                setAuthorInfo(parseAuthorInfoInBookResponse(response));
                setFeedbackInfo(parseFeedbacksInBookResponse(response));
                setLoading(false);
            })
            .catch((err) => {
                setError('Не удалось загрузить данные. Попробуйте снова позже');
                setLoading(false);
                console.error('Ошибка при запросе данных: ', err);
            });

        BookApiClient.listLibraryBooks()
            // TODO: если пользователь не авторизован?
            .then((response) => {
                if (!response.books) {
                    return;
                }
                const bookIDs = response.books.map((book) => book.id);
                setIsAddedToRead(bookIDs.includes(curBookId));
            })
        // Получение информации, находится ли книга в библиотеке
    }, [])

    if (loading) {
        return <LoadingMessage />
    }

    if (error) {
        return <ErrorMessage message={error} />;
    }

    return (
        <div className={s.bookCardWrapper}>
            <div className={s.bookCard}>
                <img className={s.bookCardImage} src={bookInfo?.coverImage} />
                <div className={s.bookCardInfo}>
                    <p className={s.bookCardTitle}>{bookInfo?.title}</p>
                    <div className={s.bookCardAuthor}>
                        Автор:{" "}
                        {authorInfo.map((author, index) => (
                            <span key={author.id}>
                            <a href={`/author/${author.id}`}>{`${author.firstName} ${author.lastName}`}</a>
                            {index < authorInfo.length - 1 && ", "}
                            </span>
                        ))}
                    </div>
                    <div className={s.bookCardAction}>
                        <div className={s.bookCardRatingInfo}>
                            <div className={s.bookCardRatingContainer}>
                                <div className={s.bookCardRatingLogo} />
                                <span className={s.bookCardRating}>{bookInfo?.rating}</span>
                            </div>
                        </div>
                        {!isAddedToRead ? 
                        <button className={s.bookCardAddToReadButton} onClick={() => changeBookToReadStateHandleClick({ isAdded: true })}>
                            Добавить в список к чтению
                        </button>
                        : 
                        <a href='/library'>
                            <button className={s.bookCardReadButton}>
                                <div>
                                    Читать
                                    <p style={{ fontSize: '16px', margin: '0', fontWeight: '300' }}>Перейти в библиотеку</p>
                                </div>
                            </button>
                        </a>}
                    </div>
                    <p className={s.bookCardDescription}><span className={s.descrpitionTitle}>Жанр:</span></p>
                    <div className={s.descriptionContainer}>
                        <span className={s.descrpitionTitle}>Описание</span>
                        <p className={s.bookCardDescription}>
                            {bookInfo?.description}
                        </p>
                    </div>
                </div>
            </div>
            <div className={s.bookCardReviews}>
                <BookReviews feedbackInfo={feedbackInfo} bookID={curBookId} />
            </div>
        </div>
    )
}

export default BookPage;