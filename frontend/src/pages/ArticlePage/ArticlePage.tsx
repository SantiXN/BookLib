import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import s from './ArticlePage.module.css';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useApi from '../../../api/ApiClient';
import { ArticleInfo } from '../../../api';

const ArticlePage = () => {
    const { ArticleApi }  = useApi();

    const { id } = useParams();
    const [data, setData] = useState<ArticleInfo | null>(null);

    useEffect(() => {
        ArticleApi.getArticle({articleID: Number(id)})
            .then((response) => {
                if (response.article) {
                    setData(response.article);
                }
            })
            .catch(() => {
                alert('Ошибка загрузки статьи!');
            });
    }, [id]);

    return (
        <div className={s.articleContainer}>
            <h1 className={s.title}>{data?.title}</h1>
            <h2 className={s.author}>Автор: {data?.author.firstName} {data?.author.lastName}</h2>
            <div className={s.articleBody}>
                <ReactMarkdown children={data?.content} remarkPlugins={[gfm]} />
            </div>
        </div>
    );
};

export default ArticlePage;
