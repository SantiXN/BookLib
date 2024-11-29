import s from './MainPage.module.css'
import BookCard from '../../component/common/BookCard/BookCard'

const MainPage = () => {
    return (
        <div className={s.mainPageContainer}>
            <BookCard 
                title={"Луна в ореховой скорлупе Луна в ореховой скорлупе"} 
                author={"Анастасия Пикина Анастасия Пикина"} 
                coverImage={"book.jpg"} 
                rating={4.8} 
                toDirect={'/'}
            />
        </div>
    )
}

export default MainPage;