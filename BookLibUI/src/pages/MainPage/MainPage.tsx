import s from './MainPage.module.css'
import BookCard from '../../component/common/BookCard/BookCard'

const books = Array(12).fill({
    title: "Луна в ореховой скорлупе Луна в ореховой скорлупе",
    author: "Анастасия Пикина Анастасия Пикина",
    coverImage: "book.jpg",
    rating: 4.8,
    toDirect: '/',
});

const MainPage = () => {
    return (
        <div className={s.mainPageContainer}>
            {books.map((book, index) => (
                <BookCard 
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
    )
}

export default MainPage;