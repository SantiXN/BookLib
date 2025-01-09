import { useEffect, useRef, useState } from 'react';
import s from '../FunctionalWindow.module.css'

interface BlockProps {
    isOpen: string | null;
    onClose: () => void;
}

const EditArticleBlock: React.FC<BlockProps> = ({ isOpen, onClose }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const [articles, setArticles] = useState<string[]>([]);
    const [article, setArticle] = useState('');

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await fetch('https://api.example.com/options');
                if (!response.ok) {
                    throw new Error('Ошибка загрузки данных');
                }
                const data: string[] = await response.json();
                setArticles(data);
            } catch (err) {
                //setError(err.message || 'Неизвестная ошибка');
            } finally {
                //setLoading(false);
            }
        };

        fetchArticles();
    }, []);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const isFieldsChanged = false; // изменять, если поля отличаются от выбранной статьи

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
        setArticle(e.target.value);
    };    

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };    
    
    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(e.target.value);
    };    

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    };   
    
    return (
        <div className={s.container}>
            <div ref={containerRef} className={`${s.block} ${s.articleBlock}`}>
                <div className={s.menuHeader}>
                    <p className={s.menuTitle}>Редактировать статью</p>
                    <span onClick={onClose} className={s.closeIcon} />
                </div>
                <div className={s.menuContainer}>
                    <form className={s.form} onSubmit={handleSubmit}>
                        <div className={s.formFieldContainer}>
                            <label className={s.formLabel} htmlFor='author'>Статья</label>
                            <select id="author" className={s.input} value={article} onChange={handleArticleChange}>
                                <option value='' disabled>Выберите...</option>
                                {articles.map((art, index) => (
                                    <option key={index} value={art}>
                                        {art}
                                    </option>
                                ))}
                            </select>
                        </div>
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
                            <label className={s.formLabel}>
                                Описание
                                <textarea className={`${s.formTextArea} ${s.articleTextArea}`} 
                                    value={description}
                                    onChange={handleDescriptionChange}
                                />
                            </label>
                        </div>
                        <div className={s.actionButtonContainer}>
                            <button
                                type="submit"
                                className={`${s.button} ${s.formButton} ${!isFieldsChanged ? s.disabledButton : ""}`}
                                disabled={isFieldsChanged}
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