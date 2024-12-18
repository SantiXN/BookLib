import s from './SearchBar.module.css'
const SearchBar = () => {
    return (
        <form className={`${s.search}`} action="">
            <input
                className={`${s.searchInput} ${s.searchInputText}`}
                name="q"
                placeholder="Поиск..."
                type="search"
            />
            <button className={s.searchButton}>Поиск</button>
        </form>
    )
}

export default SearchBar;