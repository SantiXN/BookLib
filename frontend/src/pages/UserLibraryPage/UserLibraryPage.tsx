import { useEffect, useState } from 'react';
import s from './UserLibraryPage.module.css';
import BookCard from '../../component/common/BookCard/BookCard';
import { AuthorInfo, BookInLibrary, BookInLibraryReadingStatusEnum } from '../../../api';
import { BookApiClient } from '../../../api/ApiClient';
import { FaTrash } from 'react-icons/fa';
import ChangeBookStatusBlock from './ChangeBookStatusBlock';

const UserLibraryPage = () => {
    const [inProgressBooks, setInProgressBooks] = useState<BookInLibrary[]>([]);
    const [plannedBooks, setPlannedBooks] = useState<BookInLibrary[]>([]);
    const [finishedBooks, setFinishedBooks] = useState<BookInLibrary[]>([]);

    const [selectedMenuItem, setSelectedMenuItem] = useState<string>('inProgress');
    const [currentPage, setCurrentPage] = useState<number>(1); // Текущая страница
    const booksPerPage = 15; // Количество книг на странице

    const [selectedBookID, setSelectedBookID] = useState<number | null>(0);
    const [isBookStatusChangeBlockOpen, setIsBookStatusChangeBlockOpen] = useState<boolean>(false);
    const closeWindow = () => {
        setIsBookStatusChangeBlockOpen(false);
        setSelectedBookID(null);
    }

    const handleMenuItemClick = (item: string) => {
        setSelectedMenuItem(item);
        setCurrentPage(1); // Сброс страницы на первую при смене категории
    };

    const handleNextPage = () => {
        if (currentPage * booksPerPage < getCurrentBooks().length) {
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
                    const inProgress = response.books.filter(book => book.readingStatus === 'inProgress');
                    const planned = response.books.filter(book => book.readingStatus === 'planned');
                    const finished = response.books.filter(book => book.readingStatus === 'finished');

                    setInProgressBooks(inProgress);
                    setPlannedBooks(planned);
                    setFinishedBooks(finished);
                    
                } else {
                    console.error('Failed to fetch books');
                }
            })
            .catch((error) => {
                console.error('Failed to fetch books: ', error);
            });
    }, []);

    const getCurrentBooks = () => {
        switch (selectedMenuItem) {
            case 'inProgress':
                return inProgressBooks;
            case 'planned':
                return plannedBooks;
            case 'finished':
                return finishedBooks;
            default:
                return [];
        }
    };

    // Вычисляем книги для текущей страницы
    const currentBooks = getCurrentBooks().slice(
        (currentPage - 1) * booksPerPage,
        currentPage * booksPerPage
    );

    const handleDeleteBook = async (bookId: number) => {
        if (!window.confirm('Вы уверены, что хотите удалить эту книгу из библиотеки?')) {
            return;
        }

        try {
            await BookApiClient.removeBookFromLibrary({ bookID: bookId });
            setInProgressBooks((prev) => prev.filter((book) => book.id !== bookId));
            setPlannedBooks((prev) => prev.filter((book) => book.id !== bookId));
            setFinishedBooks((prev) => prev.filter((book) => book.id !== bookId));
            alert('Книга успешно удалена из библиотеки');

        }
        catch (error) {
            console.error('Failed to remove book from library: ', error);
        }
    };

    const getAuthorsString = (authors: AuthorInfo[]) => {
        return authors.map(author => `${author.firstName} ${author.lastName}`).join(', ');
    };

    const updateBookStatusLocally = (bookId: number, newStatus: string) => {
        setInProgressBooks((prev) =>
            prev.filter((book) => book.id !== bookId)
        );
        setPlannedBooks((prev) =>
            prev.filter((book) => book.id !== bookId)
        );
        setFinishedBooks((prev) =>
            prev.filter((book) => book.id !== bookId)
        );
    
        const updatedBook = getCurrentBooks().find((book) => book.id === bookId);
        if (updatedBook) {
            const updatedBookWithNewStatus = { ...updatedBook, readingStatus: newStatus };
    
            if (newStatus === 'inProgress') {
                setInProgressBooks((prev) => [...prev, { ...updatedBookWithNewStatus, readingStatus: 'inProgress' as BookInLibraryReadingStatusEnum }]);
            } else if (newStatus === 'planned') {
                setPlannedBooks((prev) => [...prev, { ...updatedBookWithNewStatus, readingStatus: 'planned' as BookInLibraryReadingStatusEnum }]);
            } else if (newStatus === 'finished') {
                setFinishedBooks((prev) => [...prev, { ...updatedBookWithNewStatus, readingStatus: 'finished' as BookInLibraryReadingStatusEnum }]);
            }
        }
    };

    const handleChangeStatus = (bookId: number) => {
        setSelectedBookID(bookId);
        setIsBookStatusChangeBlockOpen(true);
    }

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
                                &lt;
                            </button>
                            <span className={s.paginationInfo}>
                                Страница {currentPage} из {getCurrentBooks().length > 0 ? Math.ceil(getCurrentBooks().length / booksPerPage) : 1}
                            </span>
                            <button
                                className={s.paginationButton}
                                onClick={handleNextPage}
                                disabled={currentPage * booksPerPage >= getCurrentBooks().length}
                            >
                                &gt;
                            </button>
                        </div>
                        {getCurrentBooks().length > 0 ? 
                            <div className={s.libraryBooksBodyContainer}>
                                {currentBooks.map((book, key) => (
                                    <div key={key} className={s.libraryBookContainer}>
                                        <FaTrash 
                                            className={s.deleteIcon} 
                                            onClick={() => handleDeleteBook(book.id)}
                                        />
                                        <BookCard
                                            title={book.title}
                                            author={getAuthorsString(book.authors)}
                                            coverImage={book.coverPath}
                                            rating={book.starCount}
                                            toDirect={`/book/${book.id}`}
                                            classname={s.libraryBookCard}
                                        />
                                        <button 
                                            className={s.changeStatusButton}
                                            onClick={() => handleChangeStatus(book.id)}
                                        >
                                            Изменить статус
                                        </button>
                                    </div>
                                ))}
                            </div>
                            : <p className={s.message}>В данной категории книг нет</p>
                        }
                    </div>
                </div>
            </div>
            {isBookStatusChangeBlockOpen && (
                <ChangeBookStatusBlock
                    bookID={selectedBookID!}
                    bookReadingStatus={selectedMenuItem}
                    isOpen={isBookStatusChangeBlockOpen} 
                    onUpdate={updateBookStatusLocally}
                    onClose={closeWindow}/>
            )}
        </div>
    );
};

export default UserLibraryPage;