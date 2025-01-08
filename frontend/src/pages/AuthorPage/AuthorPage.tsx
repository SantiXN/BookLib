import BookCard from '../../component/common/BookCard/BookCard';
import s from './AuthorPage.module.css'

const books = Array(12).fill({
    title: "Луна в ореховой скорлупе Луна в ореховой скорлупе",
    author: "Анастасия Пикина Анастасия Пикина",
    coverImage: "book.jpg",
    rating: 4.8,
    toDirect: '/',
});

const AuthorPage = () => {
    return (
        <div className={s.authorContainer}>
            <div className={s.authorBody}>
                <img className={s.authorImage} src='src/images/avatar/image.png'/>
                <div className={s.authorInfo}>
                    <p className={s.authorName}>Вин дизель</p>
                    <p className={s.authorDescription}>
                        Пишет про машины.Пишет про машины.Пишет про машины.Пишет про машины.Пишет про машины.Пишет про машины.Пишет про машины.Пишет про машины.Пишет про машины.Пишет про машины.Пишет про машины.Пишет про машины.Пишет про машины.Пишет про машины.Пишет про машины.Пишет про машины.Пишет про машины.Пишет про машины.Пишет про машины.Пишет про машины.Пишет про машины.Пишет про машины.
                    </p>
                </div>
            </div>
            <div className={s.authorBooksContainer}>
                <p className={s.authorBooksTitle}>Книги автора:</p>
                <div className={s.authorBooksCards}>
                    {books.map((book, index) => (<BookCard 
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
            </div>
        </div>
    )
}

export default AuthorPage;