import { useState, useEffect } from 'react';
import s from './BookReviews.module.css';
import ReviewForm from './ReviewForm';
import useApi from '../../../../api/ApiClient';
import { FeedbackInfo } from '../../../../api';

interface BookReviewsProps {
    feedbackInfo: FeedbackInfo[];
    bookID: number;
}

const BookReviews: React.FC<BookReviewsProps> = ({ feedbackInfo, bookID }) => {

    const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);

    const openReviewForm = () => setIsReviewFormOpen(true);
    const closeReviewForm = () => setIsReviewFormOpen(false);

    return (
        <div className={s.bookReviewsContainer}>
            <div className={s.bookReviewsHeader}>
                <p className={s.bookReviewsHeaderTitle}>Отзывы</p>
                <button className={s.bookReviewsAddReviewButton} onClick={openReviewForm}>
                    Оставить отзыв
                </button>
                <ReviewForm isOpen={isReviewFormOpen} onClose={closeReviewForm} bookID={bookID} />
            </div>
            <div className={s.reviews}>
                {feedbackInfo.length > 0 ? (
                    feedbackInfo.map((review, index) => (
                        <div className={s.review} key={index}>
                            <div className={s.reviewHeader}>
                                <img className={s.reviewAvatar} src={review.user.avatarPath} alt="Avatar" />
                                <p className={s.reviewAuthor}>
                                    {`${review.user.firstName}${review.user.lastName ? ' ' + review.user.lastName : ''}`}
                                </p>
                                <span className={s.reviewDate}>
                                    {new Intl.DateTimeFormat('ru-RU', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    }).format(new Date(review.postedAt! * 1000))}
                                </span>
                                <div className={s.reviewRatingContainer}>
                                    <div className={s.reviewRatingLogo} />
                                    <span className={s.reviewRating}>{review.starCount}</span>
                                </div>
                            </div>
                            <p className={s.reviewBody}>{review.comment}</p>
                        </div>
                    ))
                ) : (
                    <div style={{fontSize: '24px'}}>Отзывов нет</div>
                )}
            </div>
        </div>
    );
};

export default BookReviews;
