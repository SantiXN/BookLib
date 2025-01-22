import { useEffect, useRef, useState } from 'react';
import s from '../FunctionalWindow.module.css'
import useApi from '../../../../../api/ApiClient';
import { ArticleData } from '../../../../../api';

interface BlockProps {
    isOpen: string | null;
    onClose: () => void;
}

const RemoveArticleBlock: React.FC<BlockProps> = ({ isOpen, onClose }) => {
    const { ArticleApi } = useApi();

    const containerRef = useRef<HTMLDivElement>(null);

    const [articles, setArticles] = useState<ArticleData[]>([]);
    const [selectedArticleID, setSelectedArticleID] = useState<number | null>(null);

    useEffect(() => {
        ArticleApi.listArticles()
            .then((response) => {
                if (response.articles) {
                    setArticles(response.articles);
                } else {
                    console.error('Error fetching articles');
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
            console.log('click');
            onClose();        
        }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            onClose();
        }
    };

    useEffect(() => {
        if (isOpen != null) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleEscapeKey);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [isOpen]);    

    const handleArticleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const articleId = Number(e.target.value);
        setSelectedArticleID(articleId);
    };    

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedArticleID || !articles.some(article => article.id === selectedArticleID)) return;

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
    
    return (
        <div className={s.container}>
            <div ref={containerRef} className={`${s.block} ${s.articleBlock}`}>
                <div className={s.menuHeader}>
                    <p className={s.menuTitle}>Удалить статью</p>
                    <span onClick={onClose} className={s.closeIcon} />
                </div>
                <div className={s.menuContainer}>
                    <form className={s.form} onSubmit={handleSubmit}>
                        <div className={s.formFieldContainer}>
                            <label className={s.formLabel} htmlFor='author'>Статья</label>
                            <select id="author" className={s.input} value={selectedArticleID || ''} onChange={handleArticleChange}>
                                <option value='' disabled>Выберите...</option>
                                {articles.map((art, index) => (
                                    <option key={index} value={art.id}>
                                        {art.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <p>Восстановить статью будет невозможно.</p>
                        <div className={s.actionButtonContainer}>
                            <button
                                type="submit"
                                className={`${s.button} ${s.formButton}`}>
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