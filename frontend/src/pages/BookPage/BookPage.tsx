import React, { useEffect, useState } from 'react';
import BookReviews from '../../component/common/BookReviews/BookReviews';
import s from './BookPage.module.css'
import useApi from '../../../api/ApiClient';
import { useParams } from 'react-router-dom';
import { ParsedBookInfo } from '../../types/BookTypes';
import { parseAuthorInfoInBookResponse } from '../../utils/AuthorUtils';
import { parseBookInfoResponse } from '../../utils/BookUtils';
import { ParsedAuthorInfo } from '../../types/AuthorTypes';
import ErrorMessage from '../../component/common/ErrorMessage/ErrorMessage';
import LoadingMessage from '../../component/common/LoadingMessage/LoadingMessage';
import { FeedbackInfo } from '../../../api';

const BookPage = () => {
    const { BookApi } = useApi();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isAddedToRead, setIsAddedToRead] = useState(false);
    const changeBookToReadStateHandleClick = ({ isAdded }: { isAdded: boolean }) => {
        BookApi.addBookToLibrary({ bookID: curBookId })
            .catch((err) => {
                console.error('Не удалось добавить книгу в библиотеку: ', err);
            });
        setIsAddedToRead(isAdded); 
    };

    const [bookInfo, setBookInfo] = useState<ParsedBookInfo | null>(null);
    const [authorInfo, setAuthorInfo] = useState<ParsedAuthorInfo[]>([]);
    const [feedbackInfo, setFeedbackInfo] = useState<FeedbackInfo[]>([]);

    const { id } = useParams<{ id: string }>();
    const curBookId = id ? Number(id) : 0;

    useEffect(() => {
        BookApi.getBookInfo({ bookID: curBookId})
            .then((response) => {
                setBookInfo(parseBookInfoResponse(response));
                setAuthorInfo(parseAuthorInfoInBookResponse(response));
                setLoading(false);
            })
            .catch((err) => {
                setError('Книга с данным ID не найдена. Проверьте правильность ссылки');
                setLoading(false);
                console.error('Ошибка при запросе данных: ', err);
            });

            BookApi.listBookFeedback({bookID: curBookId})
            .then((response) => {
                if (response.feedback) {
                    setFeedbackInfo(response.feedback)
                }
            })

        BookApi.checkBookInLibrary({ bookID: curBookId })
            .then((response) => {
                if (response.contains) {
                    setIsAddedToRead(response.contains.valueOf());
                }
            })
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
                            <a href={`/author/${author.id}`}>{`${author.firstName}${author.lastName ? ' ' + author.lastName : ''}`}</a>
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
                    <p className={s.bookCardDescription}>
                        <span className={s.descrpitionTitle}>
                            Жанр:
                        </span>
                        {bookInfo?.categories.map((category, index) => (
                            <a key={index} href={`/genre/${category.id}`}> {`${category.category}`}</a>
                        ))}
                    </p>
                    <div className={s.descriptionContainer}>
                        <span className={s.descrpitionTitle}>Описание</span>
                        <p className={s.bookCardDescription}>
                            {bookInfo?.description.split('\n').map((line, index) => (
                            <React.Fragment key={index}>
                                {line}
                                <br />
                            </React.Fragment>
                        ))}
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