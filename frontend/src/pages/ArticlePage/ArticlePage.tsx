import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';  // Для поддержки таблиц и других GitHub Flavored Markdown (GFM) элементов
import s from './ArticlePage.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useApi from '../../../api/ApiClient';
import { ArticleInfo } from '../../../api';

const ArticlePage = () => {
    const { ArticleApi, AuthorApi }  = useApi();

    const navigate = useNavigate();
    const { articleID } = useParams();
    const [data, setData] = useState<ArticleInfo | null>(null);
    const [author, setAuthor] = useState('');

    useEffect(() => {
        ArticleApi.getArticle({articleID: Number(articleID)})
            .then((response) => {
                if (response.article) {
                    setData(response.article);
                }
            })
            .catch(() => {
                navigate(-1);
            });

            if (data?.authorID !== undefined) {
                AuthorApi.getAuthorInfo({authorID: data.authorID})
                    .then((response) => {
                        if (response.author) {
                            setAuthor(response.author.firstName + response.author.lastName);
                        }
                    })
                    .catch((err) => console.error(err));
            }
    }, [articleID]);

    return (
        <div className={s.articleContainer}>
            {data?.authorID && <p className={s.author}>Автор: {author}</p>}
            <div className={s.articleBody}>
                <ReactMarkdown children={data?.content} remarkPlugins={[gfm]} />
            </div>
        </div>
    );
};

export default ArticlePage;
