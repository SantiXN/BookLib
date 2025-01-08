import React, { useEffect, useRef, useState } from 'react';
import s from './ReviewForm.module.css'

interface ReviewFormProps {
    isOpen: boolean;
    onClose: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ isOpen, onClose }) => {
    const [rating, setRating] = useState<number>(0); // Состояние для хранения текущей оценки

    const handleClick = (value: number) => {
        setRating(value); // Устанавливаем рейтинг при клике на звезду
    };

    const containerRef = useRef<HTMLDivElement>(null);
    
    const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
            setRating(0);
            onClose();
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className={s.reviewFormContainer}>
            <div className={s.reviewForm} ref={containerRef}>
            <p className={s.reviewFormTitle}>Добавить отзыв</p>
            <form>
                <p className={s.fieldDescription}>Выберите оценку:</p>
                <div style={{ display: 'flex', cursor: 'pointer' }}>
                    {Array.from({ length: 5 }, (_, index) => {
                        const starValue = index + 1; // Значение звезды (1-5)
                        return (
                            <img 
                                src={starValue <= rating ? 'src/images/icon/yellow-star.png'
                                    : 'src/images/icon/not-fill-star.png'}
                                className={s.starRating}
                                key={starValue} 
                                onClick={() => handleClick(starValue)} 
                                
                            />
                        );
                    })}
                </div>
                <p className={s.fieldDescription}>Введите комментарий (необязательно)</p>
                <textarea className={s.reviewFormTextArea} />
                <div className={s.publicateReviewButtonContainer}>
                    <button 
                        disabled={rating == 0}
                        className={s.publicateReviewButton}
                    >
                        Опубликовать
                    </button>
                </div>
            </form>
        </div>
        </div>
    )
}

export default ReviewForm;