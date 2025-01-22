import React, { useEffect, useRef, useState } from 'react';
import s from '../FunctionalWindow.module.css';
import { AuthorInfo, CategoryInfo } from '../../../../../api';
import useApi from '../../../../../api/ApiClient';

interface BlockProps {
    isOpen: string | null;
    onClose: () => void;
}

const AddBookBlock: React.FC<BlockProps> = ({ isOpen, onClose }) => {
    const { AuthorApi, BookApi, CategoryApi } = useApi();

    const containerRef = useRef<HTMLDivElement>(null);

    const [authors, setAuthors] = useState<AuthorInfo[]>([]);
    const [categories, setCategories] = useState<CategoryInfo[]>([]);

    const [title, setTitle] = useState('');
    const [selectedAuthors, setSelectedAuthors] = useState<AuthorInfo[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<CategoryInfo[]>([]);
    const [description, setDescription] = useState('');
    const [bookFile, setBookFile] = useState<File | null>(null);
    const [bookCover, setBookCover] = useState<File | null>(null);

    const isFormFieldsEmpty = !(title.trim() && description.trim() && selectedAuthors.length > 0 && selectedCategories.length > 0 && bookCover && bookFile);

    const close = () => {
        setTitle('');
        setDescription('');
        setBookCover(null);
        setBookFile(null);
        onClose();
    };
    
    const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
            close();        
        }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            close();
        }
    };

    useEffect(() => {
        AuthorApi.listAuthors()
            .then((response) => {
                if (response?.authors) {
                    setAuthors(response.authors);
                }
            })
            .catch((err) => alert(`Не удалось получить список авторов. Попробуйте позже ${err}`))
        
        CategoryApi.listCategories()
            .then((response) => {
                if (response?.categories) {
                    setCategories(response.categories);
                } else {
                    alert('No categories found');
                }
            })
    }, []);

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
    
    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(e.target.value);
    };  
    
    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOptions = Array.from(e.target.selectedOptions).map(
            (option) => categories.find(category => category.id === parseInt(option.value))
        ).filter((category): category is CategoryInfo => category !== undefined);
        setSelectedCategories(selectedOptions);
    };

    const handleRemoveCategory = (id: number) => {
        setSelectedAuthors((prevAuthors) => prevAuthors.filter((author) => author.id !== id));
    };

    const handleAuthorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOptions = Array.from(e.target.selectedOptions).map(
            (option) => authors.find(author => author.id === parseInt(option.value))
        ).filter((author): author is AuthorInfo => author !== undefined);
        setSelectedAuthors(selectedOptions);
    };

    const handleRemoveAuthor = (id: number) => {
        setSelectedAuthors((prevAuthors) => prevAuthors.filter((author) => author.id !== id));
    };

    const handleBookCoverFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedBookCover = event.target.files?.[0];
        if (selectedBookCover) {
            setBookCover(selectedBookCover);
        }
    };

    const handleBookFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedBookFile = event.target.files?.[0];
        if (selectedBookFile) {
            setBookFile(selectedBookFile);
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isFormFieldsEmpty) return;
        const request = {
            addBookRequest: {
                title,
                description,
                authorIDs: selectedAuthors.map(author => author.id),
                categoryIDs: selectedCategories.map(category => category.id),
                filePath: bookFile.name,
                coverPath: bookCover.name
                
            }
        };
        console.log(request)
        BookApi.addBook(request)
            .then((response) => {
                if (response) {
                    console.log(response);
                    alert('Книга успешно добавлена!');
                    close();
                } else {
                    console.error('No response from server');
                    alert('Не удалось добавить книгу. Попробуйте позже.');
                }
            })
            .catch((error) => {
                console.error('Error adding book:', error);
                alert('Не удалось добавить книгу. Попробуйте позже.');
            });
    };

    return (
        <div className={s.container}>
            <div ref={containerRef} className={s.block}>
                <div className={s.menuHeader}>
                    <p className={s.menuTitle}>Добавить книгу</p>
                    <span onClick={onClose} className={s.closeIcon} />
                </div>
                <div className={s.menuContainer}>
                    <form className={s.form} onSubmit={handleSubmit}>
                        <div className={s.formFieldContainer}>
                            <label className={s.formLabel}>
                                Название
                                <input
                                    className={s.input}
                                    id="title"
                                    type="text"
                                    placeholder="Название"
                                    value={title}
                                    onChange={handleTitleChange}
                                />
                            </label>
                        </div>
                        <div className={s.formFieldContainer}>
                            <label className={s.formLabel} htmlFor='author'>Автор</label>
                            <select id="author" className={`${s.input} ${s.multipleInput}`} multiple onChange={handleAuthorChange}>
                                {authors.map((author, index) => (
                                    <option key={index} value={author.id}>
                                        {author.firstName} {author.lastName}
                                    </option>
                                ))}
                            </select>
                            <div className={s.selectedValues}>
                                {authors
                                    .filter((author) => selectedAuthors.includes(author))
                                    .map((selectedAuthor) => (
                                    <span key={selectedAuthor.id} className={s.selectedItem}>
                                        {selectedAuthor.firstName} {selectedAuthor.lastName}
                                        <button
                                        type="button"
                                        onClick={() => handleRemoveAuthor(selectedAuthor.id)}
                                        className={s.removeButton}
                                        >
                                        ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className={s.formFieldContainer}>
                            <label className={s.formLabel} htmlFor='category'>Автор</label>
                            <select id="category" className={`${s.input} ${s.multipleInput}`} multiple onChange={handleCategoryChange}>
                                {categories.map((category, index) => (
                                    <option key={index} value={category.id}>
                                        {category.category}
                                    </option>
                                ))}
                            </select>
                            <div className={s.selectedValues}>
                                {selectedCategories
                                    .filter((category) => selectedCategories.includes(category))
                                    .map((selectedCategory) => (
                                    <span key={selectedCategory.id} className={s.selectedItem}>
                                        {selectedCategory.category}
                                        <button
                                        type="button"
                                        onClick={() => handleRemoveCategory(selectedCategory.id)}
                                        className={s.removeButton}
                                        >
                                        ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className={s.formFieldContainer}>
                            <label className={s.formLabel}>
                                Описание
                                <textarea
                                    className={s.formTextArea}
                                    value={description}
                                    onChange={handleDescriptionChange}
                                />
                            </label>
                        </div>
                        <div className={s.formFieldContainer}>
                            <label className={s.formLabel} htmlFor='book-cover'>Изображение</label>
                            <div className={s.customFileContainer}>
                                <input
                                    accept=".jpg,.jpeg,.png"
                                    id="book-cover"
                                    type="file"
                                    className={s.fileInput}
                                    onChange={handleBookCoverFileChange}
                                />
                                <label
                                    htmlFor="book-cover"
                                    className={`${s.customFileLabel}`}
                                >
                                    {bookCover ? bookCover.name : "Выберите файл"}
                                </label>
                            </div>
                        </div>
                        <div className={s.formFieldContainer}>
                            <label className={s.formLabel} htmlFor='book-file'>Книга</label>
                            <div className={s.customFileContainer}>
                                <input
                                    accept=".pdf"
                                    id="book-file"
                                    type="file"
                                    className={s.fileInput}
                                    onChange={handleBookFileChange}
                                />
                                <label
                                    htmlFor="book-file"
                                    className={`${s.customFileLabel}`}
                                >
                                    {bookFile ? bookFile.name : "Выберите файл"}
                                </label>
                            </div>
                        </div>
                        <div className={s.actionButtonContainer}>
                            <button
                                type="submit"
                                className={`${s.button} ${s.formButton} ${isFormFieldsEmpty ? s.disabledButton : ""}`}
                                disabled={isFormFieldsEmpty}
                            >
                                Добавить
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddBookBlock;
