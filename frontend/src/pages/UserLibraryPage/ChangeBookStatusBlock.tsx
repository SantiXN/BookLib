import React, { useEffect, useRef, useState } from "react";
import s from './ChangeBookStatusBlock.module.css'
import useApi from "../../../api/ApiClient";
import { ChangeReadingStatusRequest, ChangeReadingStatusRequestReadingStatusEnum } from "../../../api";

interface BlockProps
{
    bookID: number;
    bookReadingStatus: string;
    onUpdate: (bookID: number, newStatus: string) => void;
    onClose: () => void;
    isOpen: boolean;
}

const ChangeBookStatusBlock: React.FC<BlockProps> = ({ bookID, bookReadingStatus, onClose, onUpdate, isOpen }) => {
    const { BookApi } = useApi();

    const containerRef = useRef<HTMLDivElement>(null);

    const [selectedBookStatus, setSelectedBookStatus] = useState<string>(bookReadingStatus);

    const isStatusChanged = selectedBookStatus !== bookReadingStatus;

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

    const handleBookStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedBookStatus(e.target.value);
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        if (selectedBookStatus === bookReadingStatus) return;

        const statusRequest: ChangeReadingStatusRequest = {
            readingStatus: selectedBookStatus as ChangeReadingStatusRequestReadingStatusEnum
        };

        try {
            await BookApi.changeReadingStatus({bookID: bookID, changeReadingStatusRequest: statusRequest}); // Запрос на сервер
            onUpdate(bookID, statusRequest.readingStatus);
            alert('Статус книги успешно изменен');
            onClose();
        } catch (error) {
            console.error('Ошибка обновления статуса книги:', error);
        }
    };

    return (
        <div className={s.container}>
            <div ref={containerRef} className={s.block}>
                <div className={s.menuHeader}>
                    <p className={s.menuTitle}>Изменить статус книги</p>
                    <span onClick={onClose} className={s.closeIcon} />
                </div>
                <div className={s.menuContainer}>
                    <form className={s.form} onSubmit={handleSubmit}>
                        <div className={s.formFieldContainer}>
                            <select className={s.select} onChange={handleBookStatusChange} defaultValue={bookReadingStatus}>
                                <option value='inProgress'>Читаемая</option>
                                <option value='planned'>К прочтению</option>
                                <option value='finished'>Прочитанная</option>                            
                            </select>
                        </div>
                        <div className={s.actionButtonContainer}>
                            <button
                                type="submit"
                                className={`${s.submitButton} ${!isStatusChanged ? s.disabledButton : ''}`}
                                disabled={!isStatusChanged}
                            >
                                Изменить
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ChangeBookStatusBlock;