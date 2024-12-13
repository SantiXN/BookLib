import s from './BookReviews.module.css'

interface BookReviewsProps {
    id: string
}

const BookReviews: React.FC<BookReviewsProps> = ({ id }) => {
    //TODO: подгружать отзывы по ID книги
    return (
        <div className={s.bookReviewsContainer}>
            <div className={s.bookReviewsHeader}>
                <p className={s.bookReviewsHeaderTitle}>Отзывы</p>
                <button className={s.bookReviewsAddReviewButton}>Оставить отзыв</button>
            </div>
            <div className={s.reviews}>
                <div className={s.review}>
                    <div className={s.reviewHeader}>
                        <img className={s.reviewAvatar} src='/src/images/avatar/image.png'/>
                        <p className={s.reviewAuthor}>Василий Пупкин</p>
                        <span className={s.reviewDate}>22 ноября 2024</span>
                        <div className={s.reviewRatingContainer}>
                            <div className={s.reviewRatingLogo} />
                            <span className={s.reviewRating}>5</span>
                        </div>
                    </div>
                    <p className={s.reviewBody}>Книга понравилась. Несколько сказок в одной книге. Красивые иллюстрации. При прочтении у ребенка лишь положительные эмоции.</p>
                </div>
            </div>
        </div>
    )
}

export default BookReviews;