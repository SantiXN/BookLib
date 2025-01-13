import BookCard from '../../component/common/BookCard/BookCard';
import s from './AuthorPage.module.css'
import { ParsedBookCard } from '../../types/BookTypes';
import { parseBookCardsResponse } from '../../utils/BookUtils';
import { useEffect, useState } from 'react';
import {BookApiClient, AuthorApiClient } from '../../../api/ApiClient';
import { ListAuthorBooksRequest, GetAuthorInfoRequest } from '../../../api';
import { useParams } from 'react-router-dom';
import { parseAuthorResponse } from '../../utils/AuthorUtils';
import { ParsedAuthorInfo } from '../../types/AuthorTypes';

const AuthorPage = () => {
    // TODO: Доделать и проверить!
    const [authorBooks, setAuthorBooks] = useState<ParsedBookCard[]>([]);
    const [authorInfo, setAuthorInfo] = useState<ParsedAuthorInfo>();

    const { id } = useParams<{ id: string }>();
    const curAuthorID = id ? Number(id) : 0;

    const getAuthorInfoRequest: GetAuthorInfoRequest = { authorID: curAuthorID};
    const getAuthorBooksRequest: ListAuthorBooksRequest = { authorID: curAuthorID };

    useEffect(() => {
        AuthorApiClient.getAuthorInfo(getAuthorInfoRequest)
            .then((response) => {
                console.log('id: ', id)
                const curAuthorInfo = parseAuthorResponse(response);
                if (!authorInfo) {
                    console.error(`Failed to fetch author info ${curAuthorID}:`);
                }
                else {
                    setAuthorInfo(curAuthorInfo!);
                }
            }) 

        BookApiClient.listAuthorBooks(getAuthorBooksRequest)
            .then((response) => {
                if (response && response.books) {
                    setAuthorBooks(parseBookCardsResponse(response));
                    console.log('length ', authorBooks.length)
                }
            }) 
    }, [curAuthorID]);

    return (
        <div className={s.authorContainer}>
            <div className={s.authorBody}>
                <img className={s.authorImage} src='src/images/avatar/image.png' alt=''/>
                <div className={s.authorInfo}>
                    <p className={s.authorName}>{`${authorInfo?.firstName} ${authorInfo?.lastName}`}</p>
                    <p className={s.authorDescription}>
                        {authorInfo?.description}
                    </p>
                </div>
            </div>
            <div className={s.authorBooksContainer}>
                <p className={s.authorBooksTitle}>Книги автора:</p>
                {authorBooks.length > 0 ? (
                    <div className={s.authorBooksCards}>
                        {authorBooks.map((book, index) => (
                            <BookCard
                                key={index}
                                title={book.title}
                                author={book.author}
                                coverImage={book.coverImage}
                                rating={book.rating}
                                toDirect={book.toDirect}
                                classname={s.authorsBook}
                            />
                        ))}
                    </div>
                ) : (
                    <div>У автора пока что нет книг.</div>
                )}
            </div>
        </div>
    );
};

export default AuthorPage;
