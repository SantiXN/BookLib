import s from './MainPage.module.css'
import BookCard from '../../component/common/BookCard/BookCard'

const firstGenreBooks = Array(16).fill({
    title: "Луна в ореховой скорлупе Луна в ореховой скорлупе",
    author: "Анастасия Пикина Анастасия Пикина",
    coverImage: "book.jpg",
    rating: 4.8,
    toDirect: '/',
});

const secondGenreBooks = Array(6).fill({
    title: "Луна в ореховой скорлупе Луна в ореховой скорлупе",
    author: "Анастасия Пикина Анастасия Пикина",
    coverImage: "book.jpg",
    rating: 4.8,
    toDirect: '/',
});

const thirdGenreBooks = Array(6).fill({
    title: "Луна в ореховой скорлупе Луна в ореховой скорлупе",
    author: "Анастасия Пикина Анастасия Пикина",
    coverImage: "book.jpg",
    rating: 4.8,
    toDirect: '/',
});

const MainPage = () => {
    return (
        <div className={s.container}>
            <div className={s.bookCardByTheme}>
                <p className={s.title}>Фантастика</p>
                <div className={s.block}>
                    {firstGenreBooks.map((book, index) => (<BookCard 
                        key={index}
                        title={book.title} 
                        author={book.author} 
                        coverImage={book.coverImage} 
                        rating={book.rating} 
                        toDirect={book.toDirect}
                        classname={s.mainPageItem}
                    />
                    ))}
                </div>
            </div>
            <div>
                <p className={s.title}>Мистика</p>
                <div className={s.block}>
                    {secondGenreBooks.map((book, index) => (<BookCard 
                        key={index}
                        title={book.title} 
                        author={book.author} 
                        coverImage={book.coverImage} 
                        rating={book.rating} 
                        toDirect={book.toDirect}
                        classname={s.mainPageItem}
                    />
                    ))}
                </div>
            </div>
            <div>
                <p className={s.title}>Детективы</p>
                <div className={s.block}>
                    {thirdGenreBooks.map((book, index) => (<BookCard 
                        key={index}
                        title={book.title} 
                        author={book.author} 
                        coverImage={book.coverImage} 
                        rating={book.rating} 
                        toDirect={book.toDirect}
                        classname={s.mainPageItem}
                    />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default MainPage;