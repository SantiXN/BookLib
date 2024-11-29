import React from 'react';
import s from './BookCard.module.css'

interface BookCardProps {
    title: string;
    author: string;
    coverImage: string;
    rating: number;
    toDirect: string;
}

const BookCard: React.FC<BookCardProps> = ({ title, author, coverImage, rating, toDirect }) => {
    return (
        <div>
            <div className={s.bookCard}>
                <a href={toDirect} className={s.bookCardLink} target="_blank">
                    <img src={`/src/images/book/${coverImage}`} alt={`${title}`} className={s.bookCardImage} />
                    <p className={s.bookCardTitle}>{title}</p>
                    <div className={s.bookCardInfo}>
                    <p className={s.bookCardAuthor}>{author}</p>
                        <div className={s.bookCardRating}>
                            <div className={s.bookCardRatingLogo}></div>
                            <p>{rating}</p>
                        </div>
                    </div>
                </a>
            </div>
        </div>
    );
};

export default BookCard;