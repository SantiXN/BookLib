import { useEffect, useState } from 'react';
import s from '../FunctionalWindow.module.css'
import useApi from '../../../../../api/ApiClient';
import { ArticleData, ArticleInfo, ArticleInfoStatusEnum } from '../../../../../api';

interface BlockProps {
    onClose: () => void;
    isAdmin: boolean;
}

const RemoveArticleBlock: React.FC<BlockProps> = ({ onClose, isAdmin }) => {
    const { ArticleApi } = useApi();

    const [articles, setArticles] = useState<ArticleData[]>([]);

    const [articleInfo, setArticleInfo] = useState<ArticleInfo | null>(null);
    const [selectedArticleID, setSelectedArticleID] = useState<number | null>(null);

    useEffect(() => {
        if (!isAdmin) {
            ArticleApi.managementArticles()
                .then((response) => {
                    if (response.articles) {
                        setArticles(response.articles)
                    }
                })
                .catch((err) => alert(`Ошибка получения статей: ${err}`));
        }
    }, [])   

    const handleArticleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const articleId = Number(e.target.value);
        setSelectedArticleID(articleId);
    };    

    const handleArticleChangeFromSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const articleId = Number(e.target.value);
        setSelectedArticleID(articleId);
        handleSearchArticle(articleId);
    }

    const handleSearchArticle = (id: number | null) => {
        if (!id) return;

        ArticleApi.getArticle({ articleID: id })
            .then((response) => {
                if (response.article) {
                    setArticleInfo(response.article)
                }
            })
            .catch(() => alert('Статья с заданным ID не найдена!'));
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedArticleID || !articleInfo) return;

        const confirmDelete = window.confirm('Вы уверены, что хотите удалить эту статью? Это действие необратимо.');
        if (!confirmDelete) return;

        ArticleApi.deleteArticle({articleID: selectedArticleID})
            .then(() => {
                alert('Статья успешно удалена');
                onClose();
            })
            .catch((error) => {
                console.error(error);
            });
    };   

    const close = () => {
        const confirmDelete = window.confirm('Вы точно хотите закрыть окно?');
        if (!confirmDelete) return;

        onClose();
    }
    
    return (
        <div className={s.container}>
            <div className={`${s.block} ${s.articleBlock}`}>
                <div className={s.menuHeader}>
                    <p className={s.menuTitle}>Удалить статью</p>
                    <span onClick={close} className={s.closeIcon} />
                </div>
                <div className={s.menuContainer}>
                    <form className={s.form} onSubmit={handleSubmit}>
                        {!isAdmin && (
                            <div className={s.formFieldContainer}>
                                <label className={s.formLabel} htmlFor='author'>Статья</label>
                                <select id="author" className={s.input} value={selectedArticleID || ''} onChange={handleArticleChangeFromSelect}>
                                    <option value='' disabled>Выберите...</option>
                                    {articles.map((art, index) => (
                                        <option key={index} value={art.id}>
                                            {art.title} (id={art.id})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                        {isAdmin && (
                            <div className={`${s.formFieldContainer} ${s.inputContainerFromId}`}>
                                <label className={s.formLabel} htmlFor='articleId'>ID статьи</label>
                                <input
                                    className={`${s.input} ${s.autoWidth}`}
                                    id='articleId'
                                    type='number'  
                                    value={selectedArticleID || ''}
                                    onChange={(value) => handleArticleChange(value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => handleSearchArticle(selectedArticleID)}
                                    disabled={!selectedArticleID}
                                    className={`${s.button} ${!selectedArticleID ? s.disabledButton : ''}`}
                                >
                                    Поиск
                                </button>
                            </div>
                        )}
                        {articleInfo && (
                            <div>
                                <div style={{display: 'flex', gap: '5px'}}>
                                    Название: 
                                    {articleInfo.status == ArticleInfoStatusEnum.Published ? (
                                            <a href={`/article/${selectedArticleID}`} target='_blank'><p style={{margin: 0}}>{articleInfo.title}</p></a>
                                        ) 
                                        : <p style={{margin: 0}}>{articleInfo.title}</p>
                                    }
                                </div>
                                <p>Статус: {articleInfo.status}</p>
                                <p>Восстановить статью будет невозможно.</p>
                            </div>
                        )}
                        <div className={s.actionButtonContainer}>
                            <button
                                type="submit"
                                className={`${s.button} ${s.formButton} ${!articleInfo ? s.disabledButton : ''}`}>
                                Удалить
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default RemoveArticleBlock;