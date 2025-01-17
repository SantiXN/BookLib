import { useEffect, useState, useCallback } from 'react';
import s from './ArticlesPage.module.css';
import { ArticleApiClient } from '../../../api/ApiClient';
import { ArticleData, UserData } from '../../../api';

const ArticlesPage = () => {
    const [articles, setArticles] = useState<ArticleData[]>([]);
    const [authors, setAuthors] = useState<UserData[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const loadBooks = useCallback(async () => {
        setLoading(true);
        try {
            // TODO: добавить пагинацию
            const response = await ArticleApiClient.listArticles();
            const newArticles = response.articles ? response.articles : [];
            setArticles((prevArticles) => [...prevArticles, ...newArticles]);
            setHasMore(newArticles.length > 0);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => {
        loadBooks();
    }, [loadBooks]);

    const handleLoadMore = () => {
        setPage((prevPage) => prevPage + 1);
    };

    return (
        <div className={s.container}>
            <div className={s.catalogHeader}>
                <p className={s.title}>Статьи</p>
                <div className={s.filteringContainer}></div>
            </div>
            <div className={s.catalog}>
                {articles.map((article, index) => (
                    <a
                        className={s.catalogItemLink}
                        key={index}
                        href={`/article/${article.id}`}
                    >
                        <div className={s.catalogItem}>
                            <div className={s.articleInfo}>
                                <p className={s.articleTitle}>Почему важно читать книги</p>
                                <p className={s.articleAuthor}>{article.author.firstName} {article.author.lastName}</p>
                                <p className={s.articlePublishDate}>{article.publishDate}</p>
                            </div>
                        </div>  
                    </a>
                ))}
            </div>
            {loading && <p>Loading...</p>}
            {hasMore && !loading && (
                <div className={s.loadMoreContainer}>
                    <button className={s.loadMoreButton} onClick={handleLoadMore}>
                        Загрузить еще
                    </button>
                </div>
            )}
        </div>
    );
};

export default ArticlesPage;