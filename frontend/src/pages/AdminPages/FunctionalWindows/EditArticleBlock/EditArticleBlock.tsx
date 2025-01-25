import { useEffect, useState } from 'react';
import s from '../FunctionalWindow.module.css'
import { ArticleData, ArticleInfo, ArticleInfoStatusEnum, EditArticleRequest } from '../../../../../api';
import useApi from '../../../../../api/ApiClient';
import MarkdownEditor from '@uiw/react-markdown-editor';

interface BlockProps {
    onClose: () => void;
    isAdmin: boolean;
}

const EditArticleBlock: React.FC<BlockProps> = ({ onClose, isAdmin }) => {
    const { ArticleApi } = useApi();

    const [articles, setArticles] = useState<ArticleData[]>([]);
    const [selectedArticleId, setSelectedArticleId] = useState<number | null>(null);
    const [selectedArticle, setSelectedArticle] = useState<ArticleInfo | null>(null);

    useEffect(() => {
        if (!isAdmin) {
            ArticleApi.managementArticles()
            .then((response) => {
                if (response.articles) {
                    setArticles(response.articles);
                }
            });
        }
    }, []);

    const [title, setTitle] = useState('');
    const [status, setStatus] = useState('');
    const [content, setContent] = useState('');

    const isFieldsChanged = selectedArticle 
        ? title !== selectedArticle.title || content !== selectedArticle.content || status !== selectedArticle.status 
        : false;  

    const handleChangeDescription = (value: string) => {
        setContent(value);
    } 
    
    const handleArticleChange = (id: number | null) => {
        if (!id) return;
        ArticleApi.getArticle({articleID: id})
            .then((response) => {
                if (response.article) {
                    setSelectedArticle(response.article);
                    setTitle(response.article.title);
                    setStatus(response.article.status);
                    setContent(response.article.content);
                }
                else {
                    console.error('Ошибка получения статьи');
                }
            });
    }

    const handleArticleChangeFromInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const articleId = Number(e.target.value);
        setSelectedArticleId(articleId);
    }

    const handleArticleChangeFromSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const articleId = Number(e.target.value);
        setSelectedArticleId(articleId);
        handleArticleChange(articleId);
    };    

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };    

    const updateStatus = () => {
        if (status != ArticleInfoStatusEnum.Unpublished || !selectedArticleId) return;

        ArticleApi.publishArticle({ articleID: selectedArticleId })
            .then(() => {
                setStatus(ArticleInfoStatusEnum.Published);
                alert("Статья опубликована!");
            })
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!selectedArticle || !isFieldsChanged) return;

        const updatedFields: EditArticleRequest = {};
        if (title !== selectedArticle.title) updatedFields.newTitle = title;
        if (content !== selectedArticle.content) updatedFields.newContent = content;

        ArticleApi
            .editArticle({
                articleID: selectedArticle.id,
                editArticleRequest: updatedFields
            })
            .then(() => {
                alert('Статья успешно отредактирована');
            })
            .catch((error) => {
                console.error('Ошибка редактирования статьи', error);
            });
    };   

    const close = () => {
        //const confirmDelete = window.confirm('Вы точно хотите закрыть окно?');
        //if (!confirmDelete) return;

        onClose();
    }
    
    return (
        <div className={s.container}>
            <div className={`${s.block} ${s.articleBlock}`}>
                <div className={s.menuHeader}>
                    <p className={s.menuTitle}>Редактировать статью</p>
                    <span onClick={close} className={s.closeIcon} />
                </div>
                <div className={s.menuContainer}>
                    <form className={s.form} onSubmit={handleSubmit}>
                        {!isAdmin && (
                            <div className={s.formFieldContainer}>
                                <label className={s.formLabel} htmlFor='author'>Статья</label>
                                <select id="author" className={s.input} value={selectedArticle?.id || ''} onChange={handleArticleChangeFromSelect}>
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
                                    value={selectedArticleId || ''}
                                    onChange={(value) => handleArticleChangeFromInput(value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => handleArticleChange(selectedArticleId)}
                                    disabled={!selectedArticleId}
                                    className={`${s.button} ${!selectedArticleId ? s.disabledButton : ''}`}
                                >
                                    Поиск
                                </button>
                            </div>
                        )}
                        {selectedArticle && (
                            <div style={{width: '1200px'}}>
                                <div className={s.formFieldContainer}>
                                    <label className={s.formLabel}>
                                        Название статьи
                                        <input
                                            className={s.input}
                                            id='title'
                                            type='text'
                                            placeholder='Название'
                                            value={title}
                                            onChange={handleTitleChange}
                                        />
                                    </label>
                                </div>
                                <div className={s.formFieldContainer}>
                                    <label className={s.formLabel}>Описание</label>
                                    <MarkdownEditor
                                        className={s.mdEditor}
                                        onChange={(value) => handleChangeDescription(value)}
                                        value={content}
                                        visible={true}/>
                                </div>
                                {selectedArticle.status == ArticleInfoStatusEnum.Unpublished && status !== ArticleInfoStatusEnum.Published && (
                                    <div style={{gap: '10px'}}>
                                        Статья не опубликована  
                                        <button
                                            type='button'
                                            onClick={updateStatus}
                                        >
                                            Опубликовать
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                        <div className={s.actionButtonContainer}>
                            <button
                                type="submit"
                                className={`${s.button} ${s.formButton} ${!isFieldsChanged ? s.disabledButton : ""}`}
                                disabled={!isFieldsChanged}
                            >
                                Редактировать
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default EditArticleBlock;