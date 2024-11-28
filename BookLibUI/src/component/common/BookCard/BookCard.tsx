import React from 'react';
import "./BookCard.css"

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
            <div className="book-card">
                <a href={toDirect} className='book-card__link' target="_blank">
                    <img src={`/src/images/book/${coverImage}`} alt={`${title}`} className="book-card__image" />
                    <p className="book-card__title">{title}</p>
                    <div className='book-card__info'>
                    <p className="book-card__author">{author}</p>
                        <div className="book-card__rating">
                            <div className='book-card__rating__logo'></div>
                            <p>{rating}</p>
                        </div>
                    </div>
                </a>
            </div>
        </div>
    );
};

export default BookCard;