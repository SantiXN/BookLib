import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import s from './ArticlePage.module.css';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useApi from '../../../api/ApiClient';
import { ArticleInfo } from '../../../api';

const ArticlePage = () => {
    const { ArticleApi, AuthorApi }  = useApi();

    const { id } = useParams();
    const [data, setData] = useState<ArticleInfo | null>(null);
    const [author, setAuthor] = useState('');

    useEffect(() => {
        ArticleApi.getArticle({articleID: Number(id)})
            .then((response) => {
                if (response.article) {
                    setData(response.article);
                    updateAuthor(response.article.authorID);
                }
            })
            .catch(() => {
                alert('Ошибка загрузки статьи!');
            });
    }, [id]);

    const updateAuthor = (authorID: number) => {
        AuthorApi.getAuthorInfo({ authorID: authorID })
            .then((response) => {
                if (response.author) {
                    setAuthor(`${response.author.firstName} ${response.author.lastName}`)
                }
            })
            .catch((err) => console.error(err));
    }

    return (
        <div className={s.articleContainer}>
            <p className={s.title}>{data?.title}</p>
            <p className={s.author}>Автор: {author}</p>
            <div className={s.articleBody}>
                <ReactMarkdown children={data?.content} remarkPlugins={[gfm]} />
            </div>
        </div>
    );
};

export default ArticlePage;
