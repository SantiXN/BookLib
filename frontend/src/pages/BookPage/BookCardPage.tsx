import { useState } from 'react';
import BookReviews from '../../component/common/BookReviews/BookReviews';
import s from './BookCardPage.module.css'

const BookCardPage = () => {
    const [isAddedToRead, setIsAddedToRead] = useState(false);

    const changeBookToReadStateHandleClick = ({ isAdded }: { isAdded: boolean }) => {
        setIsAddedToRead(isAdded); 
    };

    return (
        <div className={s.bookCardWrapper}>
            <div className={s.bookCard}>
                <img className={s.bookCardImage} src={`/src/images/book/book.jpg`} />
                <div className={s.bookCardInfo}>
                    <p className={s.bookCardTitle}>Луна в ореховой скорлупе</p>
                    <p className={s.bookCardAuthor}>Автор: Анастасия Пикина</p>
                    <div className={s.bookCardAction}>
                        <div className={s.bookCardRatingInfo}>
                            <div className={s.bookCardRatingContainer}>
                                <div className={s.bookCardRatingLogo} />
                                <span className={s.bookCardRating}>5,0</span>
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
                    <div className={s.descriptionContainer}>
                        <span className={s.descrpitionTitle}>Описание</span>
                        <p className={s.bookCardDescription}>
                        Луна в ореховой скорлупе» – весёлые сказки об озорном и неунывающем бельчонке Скоке, живущем в дупле на высоком-высоком дереве. Маленький Скок постоянно попадает в разные истории, которые становятся поводами для насмешек братьев, нравоучений старшей сестры, серьёзных разговоров с папой и безграничной любви мамы белки.
                        </p>
                    </div>
                </div>
            </div>
            <div className={s.bookCardReviews}>
                <BookReviews id='sd' />
            </div>
        </div>
    )
}

export default BookCardPage;