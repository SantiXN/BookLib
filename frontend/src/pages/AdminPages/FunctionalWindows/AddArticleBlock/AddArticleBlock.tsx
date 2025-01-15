import { useEffect, useRef, useState } from 'react';
import s from '../FunctionalWindow.module.css'
import MarkdownEditor from '@uiw/react-markdown-editor';
import { ArticleApiClient } from '../../../../../api/ApiClient';

interface BlockProps {
    isOpen: string | null;
    onClose: () => void;
}

const AddArticleBlock: React.FC<BlockProps> = ({ isOpen, onClose }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const isFieldsEmpty = !(title.trim() && content.trim())

    const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
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

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };    
    
    const handleChangeDescription = (value: string) => {
        setContent(value);
    } 

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isFieldsEmpty) return;

        ArticleApiClient.createArticle({ createArticleRequest: { title: title, content: content} })
            .then((response) => {
                if (response) {
                    console.log(response);
                    alert('Статья успешно добавлена');
                    onClose();
                }
            })
            .catch((error) => {
                console.error(error);
                alert('Ошибка добавления статьи');
            });
    };   
    
    return (
        <div className={s.container}>
            <div ref={containerRef} className={`${s.block} ${s.articleBlock}`}>
                <div className={s.menuHeader}>
                    <p className={s.menuTitle}>Добавить статью</p>
                    <span onClick={onClose} className={s.closeIcon} />
                </div>
                <div className={s.menuContainer}>
                    <form className={s.form} onSubmit={handleSubmit}>
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
                        <div className={s.actionButtonContainer}>
                            <button
                                type="submit"
                                className={`${s.button} ${s.formButton} ${isFieldsEmpty ? s.disabledButton : ""}`}
                                disabled={isFieldsEmpty}
                            >
                                Опубликовать
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AddArticleBlock;