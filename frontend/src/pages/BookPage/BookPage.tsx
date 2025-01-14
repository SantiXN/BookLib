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

    // TODO: добавление проверять через список книг, находящихся в библиотеке пользователя
    const [isAddedToRead, setIsAddedToRead] = useState(false);
    const changeBookToReadStateHandleClick = ({ isAdded }: { isAdded: boolean }) => {
        setIsAddedToRead(isAdded); 
    };

    const [bookInfo, setBookInfo] = useState<ParsedBookInfo | null>(null);
    const [authorInfo, setAuthorInfo] = useState<ParsedAuthorInfo[]>([]);
    const [feedbackInfo, setFeedbackInfo] = useState<ParsedFeedbackInfo[]>([]);

    const { id } = useParams<{ id: string }>();
    const curBookId = id ? Number(id) : 0;
    const request: GetBookInfoRequest = { bookID: curBookId};

    useEffect(() => {
        BookApiClient.getBookInfo(request)
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
                        <div>
                            <button className={s.bookCardReadButton}>Читать</button> 
                            <button className={s.bookCardDeleteBookButton} onClick={() => changeBookToReadStateHandleClick({ isAdded: true })}>Удалить из списка чтения</button>   
                        </div>}
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
                <BookReviews feedbackInfo={feedbackInfo} />
            </div>
        </div>
    )
}

export default BookPage;