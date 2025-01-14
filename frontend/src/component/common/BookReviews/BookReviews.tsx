import { useState, useEffect } from 'react';
import s from './BookReviews.module.css';
import ReviewForm from './ReviewForm';
import { ParsedFeedbackInfo } from '../../../types/FeedbackTypes';
import { UserApiClient } from '../../../../api/ApiClient';
import { GetUserDataRequest } from '../../../../api';

interface BookReviewsProps {
    feedbackInfo: ParsedFeedbackInfo[];
    bookID: number;
}

const BookReviews: React.FC<BookReviewsProps> = ({ feedbackInfo, bookID }) => {
    const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
    const [userNames, setUserNames] = useState<Record<number, string>>({});
    const [userAvatarPaths, setUserAvatarPaths] = useState<Record<number, string>>({});

    useEffect(() => {
        const fetchUserNames = async () => {
            const names: Record<number, string> = {};
            const avatarPaths: Record<number, string> = {};

            // Выполняем запросы параллельно
            const userRequests = feedbackInfo.map((review) => {
                const request: GetUserDataRequest = { userID: review.userID };
                return UserApiClient.getUserData(request)
                    .then((response) => {
                        names[review.userID] = `${response.data?.firstName} ${response.data?.lastName}`;
                        avatarPaths[review.userID] = response.data?.avatarPath || '';
                    })
                    .catch(() => {
                        console.error('Failed to fetch user data for feedbacks')
                    });
            });

            await Promise.all(userRequests); 
            setUserNames(names); 
            setUserAvatarPaths(avatarPaths);
        };

        fetchUserNames();
    }, [feedbackInfo]); 

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
                    feedbackInfo.map((review) => (
                        <div className={s.review} key={review.id}>
                            <div className={s.reviewHeader}>
                                <img className={s.reviewAvatar} src={userAvatarPaths[review.userID]} alt="Avatar" />
                                <p className={s.reviewAuthor}>
                                    {userNames[review.userID] || "Loading..."}
                                </p>
                                <span className={s.reviewDate}>{review.postedAt}</span>
                                <div className={s.reviewRatingContainer}>
                                    <div className={s.reviewRatingLogo} />
                                    <span className={s.reviewRating}>{review.starCount}</span>
                                </div>
                            </div>
                            <p className={s.reviewBody}>{review.comment}</p>
                        </div>
                    ))
                ) : (
                    <div>Отзывов нет</div>
                )}
            </div>
        </div>
    );
};

export default BookReviews;
