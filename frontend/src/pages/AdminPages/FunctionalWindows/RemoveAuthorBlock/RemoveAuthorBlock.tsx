import React, { useState } from 'react';
import s from '../FunctionalWindow.module.css'
import { AuthorInfo } from '../../../../../api';
import useApi from '../../../../../api/ApiClient';

interface BlockProps {
    onClose: () => void;
}

const RemoveAuthorBlock: React.FC<BlockProps> = ({ onClose }) => {
    const { AuthorApi } = useApi();

    const [authorInfo, setAuthorInfo] = useState<AuthorInfo | null>(null);

    const [selectedAuthorID, setSelectedAuthorID] = useState<number | null>(null);

    const handleAuthorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const authorID = Number(e.target.value);
        setSelectedAuthorID(authorID);
    }; 

    const handleSearchAuthor = () => {
        if (!selectedAuthorID) return;

        AuthorApi.getAuthorInfo({ authorID: selectedAuthorID })
            .then((response) => {
                if (response.author) {
                    setAuthorInfo(response.author)
                }
            })
            .catch(() => alert('Автора с заданным ID не найден!'));
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!selectedAuthorID || !authorInfo) return;

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

    const close = () => {
        const confirmDelete = window.confirm('Вы точно хотите закрыть окно?');
        if (!confirmDelete) return;

        onClose();
    }

    return (
        <div className={s.container}>
            <div className={s.block}>
                <div className={s.menuHeader}>
                    <p className={s.menuTitle}>Удалить автора</p>
                    <span onClick={close} className={s.closeIcon} />
                </div>
                <div className={s.menuContainer}>
                    <form className={s.form} onSubmit={handleSubmit}>
                        <div className={`${s.formFieldContainer} ${s.inputContainerFromId}`}>
                            <label className={s.formLabel} htmlFor='authorId'>ID автора</label>
                            <input
                                className={`${s.input} ${s.autoWidth}`}
                                id='authorId'
                                type='number'  
                                value={selectedAuthorID || ''}
                                onChange={(value) => handleAuthorChange(value)}
                            />
                            <button
                                type="button"
                                onClick={handleSearchAuthor}
                                disabled={!selectedAuthorID}
                                className={`${s.button} ${!selectedAuthorID ? s.disabledButton : ''}`}
                            >
                                Поиск
                            </button>
                        </div>
                        {authorInfo && (
                            <div>
                                <a href={`/author/${selectedAuthorID}`} target='_blank'><p>{authorInfo.firstName} {authorInfo.lastName}</p></a>
                            </div>
                        )}
                        <div className={s.actionButtonContainer}>
                            <button
                                type="submit"
                                className={`${s.button} ${s.formButton} ${!authorInfo ? s.disabledButton : ""}`}
                                disabled={!authorInfo}
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