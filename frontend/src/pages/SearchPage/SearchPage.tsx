import { useSearchParams } from 'react-router-dom';
import s from './SearchPage.module.css';
import { useEffect, useState, useCallback } from 'react';
import useApi from '../../../api/ApiClient';
import { ParsedBookCard } from '../../types/BookTypes';
import { parseBookCardsResponse } from '../../utils/BookUtils';
import { ArticleData, AuthorInfo } from '../../../api';
import BookCard from '../../component/common/BookCard/BookCard';

const SearchPage = () => {
    const { ArticleApi, AuthorApi, BookApi } = useApi();

    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get('q');
    const initialCategory = searchParams.get('category') || 'books';
    const initialPage = parseInt(searchParams.get('page') || '1', 10);

    const itemsInPage = 6;

    const [books, setBooks] = useState<ParsedBookCard[]>([]);
    const [articles, setArticles] = useState<ArticleData[]>([]);
    const [authors, setAuthors] = useState<AuthorInfo[]>([]);
    const [page, setPage] = useState(initialPage);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);

    const loadSearchResults = useCallback(async () => {
        if (!query) return;
        setLoading(true);
        try {
            let response: any;
            switch (selectedCategory) {
                case 'books':
                    response = await BookApi.searchBooks({
                        searchBooksRequest: { searchString: query },
                        page: page,
                        limit: itemsInPage
                    });
                    if (response) {
                        const newBooks = parseBookCardsResponse(response);
                        setBooks((prevBooks) => [...prevBooks, ...newBooks]);
                        setHasMore(response.totalCount > books.length + newBooks.length);
                    }
                    break;
                case 'authors':
                    response = await AuthorApi.searchAuthors({
                        searchAuthorsRequest: { searchString: query },
                        page: page,
                        limit: itemsInPage
                    });
                    if (response) {
                        const newAuthors = response.authors;
                        setAuthors((prevAuthors) => [...prevAuthors, ...newAuthors]);
                        setHasMore(response.totalCount > authors.length + newAuthors.length);
                    }
                    break;
                case 'articles':
                    response = await ArticleApi.searchArticles({
                        searchArticlesRequest: { searchString: query },
                        page: page,
                        limit: itemsInPage
                    });
                    if (response) {
                        const newArticles = response.articles;
                        setArticles((prevArticles) => [...prevArticles, ...newArticles]);
                        setHasMore(response.totalCount > articles.length + newArticles.length);
                    } 
                    break;
                default:
                    break;
            }
        } catch (err) {
            setHasMore(false);
            console.error('Failed to fetch search items: ', err);
        } finally {
            setLoading(false);
        }
    }, [query, page, selectedCategory]);

    useEffect(() => {
        loadSearchResults();
    }, [query, page, loadSearchResults]);

    useEffect(() => {
        setSearchParams({ q: query || '', category: selectedCategory, page: page.toString() });
    }, [query, selectedCategory, page, setSearchParams]);

    const handleLoadMore = () => {
        setPage((prevPage) => prevPage + 1);
    };

    useEffect(() => {
        // Сбрасываем данные и страницу при новом запросе
        setBooks([]);
        setArticles([]);
        setAuthors([]);
        setPage(1);
        setHasMore(true);
    }, [query, selectedCategory]);
    

    const handleCategoryClick = (category: string) => {
        setSelectedCategory(category);
        setPage(1);
        setBooks([]);
        setArticles([]);
        setAuthors([]);
    };

    return (
        <div className={s.container}>
            <div className={s.resultsContainer}>
                <p className={s.searchTitle}>Результаты поиска «{query}»</p>
                <div className={s.searchCategoriesContainer}>
                    <div
                        className={`${s.searchCategory} ${selectedCategory === 'books' ? s.selected : ''}`}
                        onClick={() => handleCategoryClick('books')}
                    >
                        <div className={s.searchCategoryName}>Книги</div>
                    </div>
                    <div
                        className={`${s.searchCategory} ${selectedCategory === 'articles' ? s.selected : ''}`}
                        onClick={() => handleCategoryClick('articles')}
                    >
                        <div className={s.searchCategoryName}>Статьи</div>
                    </div>
                    <div
                        className={`${s.searchCategory} ${selectedCategory === 'authors' ? s.selected : ''}`}
                        onClick={() => handleCategoryClick('authors')}
                    >
                        <div className={s.searchCategoryName}>Авторы</div>
                    </div>
                </div>
                <div className={s.searchCategoryItemsContainer}>
                    {selectedCategory === 'books' && (
                        <div className={s.searchBooksContainer}>
                            {books.map((book, key) => (
                                <BookCard
                                    key={key}
                                    title={book.title}
                                    author={book.author}
                                    rating={book.rating}
                                    toDirect={book.toDirect}
                                    coverImage={book.coverImage}
                                    classname={`${s.searchBook}`}
                                />
                            ))}
                        </div>
                    )}
                    {selectedCategory === 'authors' && (
                        <div className={s.searchItemsContainer}>
                            {authors.map((author, key) => (
                                <a className={s.categoryLink} key={key} href={`/author/${author.id}`}>
                                    <div className={s.searchAuthor}>
                                        <p className={`${s.authorName} ${s.textEllipsis}`}>{author.firstName} {author.lastName}</p>
                                        <p className={`${s.authorDescription} ${s.textEllipsis}`}>{author.description}</p>
                                    </div>
                                </a>
                            ))}
                        </div>
                    )}
                    {selectedCategory === 'articles' && (
                        <div className={s.searchItemsContainer}>
                            {articles.map((article, key) => (
                                <a className={s.categoryLink} key={key} href={`/article/${article.id}`}>
                                    <div className={s.searchArticle}>
                                        <p className={`${s.articleTitle} ${s.textEllipsis}`}>{article.title}</p>
                                        <p className={`${s.articleAuthor} ${s.textEllipsis}`}>{article.author.firstName} {article.author.lastName}</p>
                                        <p className={`${s.articlePublishDate} ${s.textEllipsis}`}>
                                        {new Intl.DateTimeFormat('ru-RU', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        }).format(new Date(article.publishDate! * 1000))}
                                        </p>
                                    </div>
                                </a>
                            ))}
                        </div>
                    )}
                    {((selectedCategory == 'books' && books.length == 0)
                        || (selectedCategory == 'authors' && authors.length == 0)
                        || (selectedCategory == 'articles' && articles.length == 0)) && (
                            <p>Совпадений не найдено!</p>
                        )
                    }
                </div>
            </div>
            {loading && <p>Loading...</p>}
            {hasMore && !loading && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <button className={s.loadMoreButton} onClick={handleLoadMore}>
                        Загрузить еще
                    </button>
                </div>
            )}
        </div>
    );
};

export default SearchPage;