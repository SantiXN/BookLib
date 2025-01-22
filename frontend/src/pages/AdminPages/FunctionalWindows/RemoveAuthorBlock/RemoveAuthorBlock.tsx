import React, { useEffect, useRef, useState } from 'react';
import s from '../FunctionalWindow.module.css'
import { AuthorInfo } from '../../../../../api';
import useApi from '../../../../../api/ApiClient';

interface BlockProps {
    isOpen: string | null;
    onClose: () => void;
}

const RemoveAuthorBlock: React.FC<BlockProps> = ({ isOpen, onClose }) => {
    const { AuthorApi } = useApi();

    const containerRef = useRef<HTMLDivElement>(null);

    const [authors, setAuthors] = useState<AuthorInfo[]>([]);
    const [selectedAuthorID, setSelectedAuthorID] = useState<number | null>(null);

    useEffect(() => {
        AuthorApi.listAuthors()
            .then((response) => {
                if (response.authors) {
                    setAuthors(response.authors);
                } else {
                    console.error('Error fetching authors');
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

    const handleAuthorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const authorID = Number(e.target.value);
        setSelectedAuthorID(authorID);
    }; 

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!selectedAuthorID || !authors.some(author => author.id === selectedAuthorID)) return;

        const confirmDelete = window.confirm('Вы уверены, что хотите удалить этого автора? Это действие необратимо.');
        if (!confirmDelete) return;

        AuthorApi.deleteAuthor({authorID: selectedAuthorID})
            .then(() => {
                alert('Автор успешно удален');
                onClose();
            })
            .catch((error) => {
                console.error(error);
            });
    };    

    return (
        <div className={s.container}>
            <div ref={containerRef} className={s.block}>
                <div className={s.menuHeader}>
                    <p className={s.menuTitle}>Удалить автора</p>
                    <span onClick={onClose} className={s.closeIcon} />
                </div>
                <div className={s.menuContainer}>
                    <form className={s.form} onSubmit={handleSubmit}>
                        <div className={s.formFieldContainer}>
                            <label className={s.formLabel} htmlFor='author'>Автор</label>
                            <select id="author" className={s.input} value={selectedAuthorID || ''} onChange={handleAuthorChange}>
                                <option value='' disabled>Выберите...</option>
                                {authors.map((author, index) => (
                                    <option key={index} value={author.id}>
                                        {author.firstName} {author.lastName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className={s.actionButtonContainer}>
                            <button
                                type="submit"
                                className={`${s.button} ${s.formButton} ${!selectedAuthorID ? s.disabledButton : ""}`}
                                disabled={!selectedAuthorID}
                            >
                                Удалить
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default RemoveAuthorBlock;