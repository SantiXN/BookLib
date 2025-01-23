import { useEffect, useState } from 'react';
import s from './UserLibraryPage.module.css';
import BookCard from '../../component/common/BookCard/BookCard';
import {
    AuthorInfo,
    BookInLibrary,
    ListLibraryBooksByStatusRequestReadingStatusEnum
} from '../../../api';
import useApi from '../../../api/ApiClient';
import { FaTrash } from 'react-icons/fa';
import ChangeBookStatusBlock from './ChangeBookStatusBlock';
import { FaReadme } from 'react-icons/fa6';

const UserLibraryPage = () => {
    const { BookApi, FileApi } = useApi();
    
    const [inProgressBooks, setInProgressBooks] = useState<BookInLibrary[]>([]);
    const [plannedBooks, setPlannedBooks] = useState<BookInLibrary[]>([]);
    const [finishedBooks, setFinishedBooks] = useState<BookInLibrary[]>([]);

    const [selectedMenuItem, setSelectedMenuItem] = useState<string>('inProgress');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const booksPerPage = 15;

    const [inProgressBookCount, setInProgressBookCount] = useState(0);
    const [plannedBookCount, setPlannedBookCount] = useState(0);
    const [finishedBookCount, setFinishedBookCount] = useState(0);

    const [selectedBookID, setSelectedBookID] = useState<number | null>(null);
    const [isBookStatusChangeBlockOpen, setIsBookStatusChangeBlockOpen] = useState<boolean>(false);

    const closeWindow = () => {
        setIsBookStatusChangeBlockOpen(false);
        setSelectedBookID(null);
    };

    const handleMenuItemClick = (item: string) => {
        setSelectedMenuItem(item);
        setCurrentPage(1);
        fetchBooks(item, 1);
    };

    const handleNextPage = () => {
        if (currentPage * booksPerPage < getCountBooks()) {
            setCurrentPage((prev) => {
                const nextPage = prev + 1;
                fetchBooks(selectedMenuItem, nextPage);
                return nextPage;
            });
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prev) => {
                const prevPage = prev - 1;
                fetchBooks(selectedMenuItem, prevPage);
                return prevPage;
            });
        }
    };

    const fetchBooks = (status: string, page: number) => {
        const readingStatus = getReadingStatusEnum(status);
        BookApi.listLibraryBooksByStatus({
            listLibraryBooksByStatusRequest: { readingStatus },
            limit: booksPerPage,
            page
        })
            .then((response) => {
                if (readingStatus === ListLibraryBooksByStatusRequestReadingStatusEnum.InProgress) {
                    setInProgressBookCount(response.totalNumber);
                    setInProgressBooks(response.books || []);
                } else if (readingStatus === ListLibraryBooksByStatusRequestReadingStatusEnum.Planned) {
                    setPlannedBookCount(response.totalNumber);
                    setPlannedBooks(response.books || []);
                } else if (readingStatus === ListLibraryBooksByStatusRequestReadingStatusEnum.Finished) {
                    setFinishedBookCount(response.totalNumber);
                    setFinishedBooks(response.books || []);
                }
            })
            .catch((error) => {
                console.error('Failed to fetch books: ', error);
            });
    };

    useEffect(() => {
        fetchBooks('inProgress', 1);
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

    const getCountBooks = () => {
        switch (selectedMenuItem) {
            case 'inProgress':
                return inProgressBookCount;
            case 'planned':
                return plannedBookCount;
            case 'finished':
                return finishedBookCount;
            default:
                return 0;
        }
    };

    const getReadingStatusEnum = (status: string) => {
        switch (status) {
            case 'inProgress':
                return ListLibraryBooksByStatusRequestReadingStatusEnum.InProgress;
            case 'planned':
                return ListLibraryBooksByStatusRequestReadingStatusEnum.Planned;
            case 'finished':
                return ListLibraryBooksByStatusRequestReadingStatusEnum.Finished;
            default:
                return ListLibraryBooksByStatusRequestReadingStatusEnum.InProgress;
        }
    };

    const handleDeleteBook = async (bookId: number) => {
        if (!window.confirm('Вы уверены, что хотите удалить эту книгу из библиотеки?')) {
            return;
        }

        try {
            await BookApi.removeBookFromLibrary({ bookID: bookId });
            setInProgressBooks((prev) => prev.filter((book) => book.id !== bookId));
            setPlannedBooks((prev) => prev.filter((book) => book.id !== bookId));
            setFinishedBooks((prev) => prev.filter((book) => book.id !== bookId));
            alert('Книга успешно удалена из библиотеки');
        } catch (error) {
            console.error('Failed to remove book from library: ', error);
        }
    };

    const getAuthorsString = (authors: AuthorInfo[]) => {
        return authors.map((author) => `${author.firstName} ${author.lastName}`).join(', ');
    };

    const handleChangeStatus = (bookId: number) => {
        setSelectedBookID(bookId);
        setIsBookStatusChangeBlockOpen(true);
    };

    const totalPages = Math.ceil(getCountBooks() / booksPerPage) || 1;

    const handleOpenBook = async (id: number) => {
        try {
            // Получаем информацию о книге
            const response = await BookApi.getBookInfo({ bookID: id });
            if (!response.book) {
                alert('Ошибка получения URL для книги!');
                return;
            }
    
            // Получаем файл
            // const fileResponse = await FileApiClient.getFile({
            //     filePath: response.book.filePath,
            // });
    
            // Создаем Blob-объект для файла
            // const blob = new Blob([fileResponse.data], { type: fileResponse.headers['content-type'] });
    
            // // Генерируем ссылку для скачивания
            // const downloadUrl = URL.createObjectURL(blob);
    
            // // Создаем временную ссылку
            // const a = document.createElement('a');
            // a.href = downloadUrl;
            // a.download = response.book.title || 'book.pdf'; // Укажите имя файла
            // document.body.appendChild(a);
            // a.click();
    
            // // Очищаем ссылку
            // URL.revokeObjectURL(downloadUrl);
            // document.body.removeChild(a);
    
        } catch (error) {
            console.error('Ошибка при скачивании файла:', error);
            alert('Не удалось скачать файл!');
        }
    };

    return (
        <div className={s.libraryContainer}>
            <div>
                <p className={s.title}>Мои книги</p>
                <div className={s.library}>
                    <div className={s.libraryMenu}>
                        {['inProgress', 'planned', 'finished'].map((status) => (
                            <div
                                key={status}
                                className={`${s.libraryMenuItem} ${selectedMenuItem === status ? s.libraryMenuSelectedItem : ''}`}
                                onMouseDown={() => handleMenuItemClick(status)}
                            >
                                {status === 'inProgress' ? 'Читаемые' : status === 'planned' ? 'К прочтению' : 'Прочитанные'}
                            </div>
                        ))}
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
                                Страница {currentPage} из {totalPages}
                            </span>
                            <button
                                className={s.paginationButton}
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                            >
                                &gt;
                            </button>
                        </div>
                        {getCurrentBooks().length > 0 ? (
                            <div className={s.libraryBooksBodyContainer}>
                                {getCurrentBooks().map((book, key) => (
                                    <div key={key} className={s.libraryBookContainer}>
                                        <FaTrash
                                            className={s.deleteIcon}
                                            onClick={() => handleDeleteBook(book.id)}
                                        />
                                        <BookCard
                                            title={book.title}
                                            author={getAuthorsString(book.authors)}
                                            coverImage={book.coverPath || ''}
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
                                        <FaReadme onClick={()=> handleOpenBook(book.id)} color='#2441C1' size={22} className={s.readButton}/>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className={s.message}>В данной категории книг нет</p>
                        )}
                    </div>
                </div>
            </div>
            {isBookStatusChangeBlockOpen && (
                <ChangeBookStatusBlock
                    bookID={selectedBookID!}
                    bookReadingStatus={selectedMenuItem}
                    isOpen={isBookStatusChangeBlockOpen}
                    onUpdate={() => fetchBooks(selectedMenuItem, currentPage)}
                    onClose={closeWindow}
                />
            )}
        </div>
    );
};

export default UserLibraryPage;