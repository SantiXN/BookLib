import { useEffect, useState, useCallback } from 'react';
import s from './ArticlesPage.module.css';
import useApi from '../../../api/ApiClient';
import { ArticleData } from '../../../api';

const ArticlesPage = () => {
    const { ArticleApi } = useApi();

    const [articles, setArticles] = useState<ArticleData[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const articlesInPage = 20;

    const loadBooks = useCallback(async () => {
        setLoading(true);
        try {
            const response = await ArticleApi.listArticles({ limit: articlesInPage, page: page});
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
                        target="_blank"
                    >
                        <div className={s.catalogItem}>
                            <div className={s.articleInfo}>
                                <p className={s.articleTitle}>{article.title}</p>
                                <p className={s.articleAuthor}>{article.author.firstName} {article.author.lastName}</p>
                                <p className={s.articlePublishDate}>
                                {new Intl.DateTimeFormat('ru-RU', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                }).format(new Date(article.publishDate! * 1000))}
                                </p>
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