import React, { useEffect, useRef, useState } from 'react';
import s from './ReviewForm.module.css';
import { SaveBookFeedbackOperationRequest } from '../../../../api';
import { BookApiClient } from '../../../../api/ApiClient';
import { getFeedbackOperationRequest } from '../../../utils/FeedbackUtils';

interface ReviewFormProps {
    isOpen: boolean;
    onClose: () => void;
    bookID: number;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ isOpen, onClose, bookID }) => {
    const [rating, setRating] = useState<number>(0); // Состояние для хранения текущей оценки
    const [comment, setComment] = useState<string>(''); // Состояние для комментария
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // Состояние для загрузки
    const [successMessage, setSuccessMessage] = useState<boolean>(false); // Состояние для успешного сообщения

    const containerRef = useRef<HTMLDivElement>(null);
    
    const handleClick = (value: number) => {
        setRating(value);
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            onClose();
        }
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
            onClose();
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleEscapeKey);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const request: SaveBookFeedbackOperationRequest = getFeedbackOperationRequest(bookID, rating, comment);

        try {
            await BookApiClient.saveBookFeedback(request);

            setRating(0);
            setComment('');
            setSuccessMessage(true);
            setTimeout(() => {
                setSuccessMessage(false);
                onClose();
            }, 3000);
        } catch (error) {
            console.error('Ошибка при отправке отзыва:', error);
            alert('Не удалось отправить отзыв. Попробуйте позже.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={s.reviewFormContainer}>
            <div className={s.reviewForm} ref={containerRef}>
                {successMessage ? (
                    <p className={s.successMessage}>Отзыв успешно отправлен!</p>
                ) : (
                    <div>
                        <p className={s.reviewFormTitle}>Добавить отзыв</p>
                        <form onSubmit={handleSubmit}>
                            <p className={s.fieldDescription}>Выберите оценку:</p>
                            <div style={{ display: 'flex', cursor: 'pointer', width: 'fit-content' }}>
                                {Array.from({ length: 5 }, (_, index) => {
                                    const starValue = index + 1;
                                    return (
                                        <img 
                                            src={
                                                starValue <= rating
                                                    ? '../src/images/icon/yellow-star.png'
                                                    : '../src/images/icon/not-fill-star.png'
                                            }
                                            className={s.starRating}
                                            key={starValue} 
                                            onClick={() => handleClick(starValue)} 
                                        />
                                    );
                                })}
                            </div>
                            <p className={s.fieldDescription}>Введите комментарий (необязательно):</p>
                            <textarea
                                className={s.reviewFormTextArea}
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />
                            <div className={s.publicateReviewButtonContainer}>
                                <button
                                    type="submit"
                                    disabled={rating === 0 || isSubmitting}
                                    className={s.publicateReviewButton}
                                >
                                    {isSubmitting ? 'Отправка...' : 'Опубликовать'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReviewForm;
