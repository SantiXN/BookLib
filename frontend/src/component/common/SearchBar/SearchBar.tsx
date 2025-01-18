import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import s from './SearchBar.module.css';

const SearchBar = () => {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (query: string) => {
        navigate(`/search/?q=${encodeURIComponent(query)}`);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        handleSearch(query);
    };

    return (
        <form className={s.search} onSubmit={handleSubmit}>
            <input
                className={`${s.searchInput} ${s.searchInputText}`}
                name="q"
                placeholder="Поиск..."
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <button className={s.searchButton} type="submit">Поиск</button>
        </form>
    );
};

export default SearchBar;