import { useEffect, useState } from 'react';
import s from './UserLibraryPage.module.css';
import BookCard from '../../component/common/BookCard/BookCard';
import { BookInLibrary } from '../../../api';
import { BookApiClient } from '../../../api/ApiClient';

const UserLibraryPage = () => {
    const [userBooks, setUsersBooks] = useState<BookInLibrary[]>([]);
    const [selectedMenuItem, setSelectedMenuItem] = useState<string>('inProgress');
    const [currentPage, setCurrentPage] = useState<number>(1); // Текущая страница
    const booksPerPage = 15; // Количество книг на странице

    const handleMenuItemClick = (item: string) => {
        setSelectedMenuItem(item);
        setCurrentPage(1); // Сброс страницы на первую при смене категории
    };

    const handleNextPage = () => {
        if (currentPage * booksPerPage < userBooks.length) {
            setCurrentPage(currentPage + 1); // Переход к следующей странице
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1); // Переход к предыдущей странице
        }
    };

    useEffect(() => {
        BookApiClient.listLibraryBooks()
            .then((response) => {
                if (response.books) {
                    setUsersBooks(response.books);
                } else {
                    console.error('Failed to fetch books');
                }
            })
            .catch((error) => {
                console.error('Failed to fetch books: ', error);
            });
    }, []);

    // Вычисляем книги для текущей страницы
    const currentBooks = userBooks.slice(
        (currentPage - 1) * booksPerPage,
        currentPage * booksPerPage
    );

    return (
        <div className={s.libraryContainer}>
            <div>
                <p className={s.title}>Мои книги</p>
                <div className={s.library}>
                    <div className={s.libraryMenu}>
                        <div
                            className={`${s.libraryMenuItem} ${selectedMenuItem === 'inProgress' ? s.libraryMenuSelectedItem : ''}`}
                            onMouseDown={() => {
                                selectedMenuItem !== 'inProgress' && handleMenuItemClick('inProgress');
                            }}
                        >
                            Читаемые
                        </div>
                        <div
                            className={`${s.libraryMenuItem} ${selectedMenuItem === 'planned' ? s.libraryMenuSelectedItem : ''}`}
                            onMouseDown={() => {
                                selectedMenuItem !== 'planned' && handleMenuItemClick('planned');
                            }}
                        >
                            К прочтению
                        </div>
                        <div
                            className={`${s.libraryMenuItem} ${selectedMenuItem === 'finished' ? s.libraryMenuSelectedItem : ''}`}
                            onMouseDown={() => {
                                selectedMenuItem !== 'finished' && handleMenuItemClick('finished');
                            }}
                        >
                            Прочитанные
                        </div>
                    </div>
                    <div className={s.libraryBooksContainer}>
                        <div className={s.pagination}>
                            <button
                                className={s.paginationButton}
                                onClick={handlePreviousPage}
                                disabled={currentPage === 1}
                            >
                                Назад
                            </button>
                            <span className={s.paginationInfo}>
                                Страница {currentPage} из {Math.ceil(userBooks.length / booksPerPage)}
                            </span>
                            <button
                                className={s.paginationButton}
                                onClick={handleNextPage}
                                disabled={currentPage * booksPerPage >= userBooks.length}
                            >
                                Вперед
                            </button>
                        </div>
                        <div className={s.libraryBooksBodyContainer}>
                            {currentBooks.map((book, key) => (
                                <BookCard
                                    key={key}
                                    title={book.title}
                                    author=''
                                    coverImage={book.coverPath}
                                    rating={book.starCount}
                                    toDirect={`/book/${book.id}`}
                                    classname={s.libraryBookCard}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserLibraryPage;
