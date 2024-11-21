import {Link} from "react-router-dom";
import s from './menu.module.css'

const MenuItem = ({children, to}) => (
    <li>
        <Link to={to} className={s.menuItem}>{children}</Link>
    </li>
);

const MegaDropdown = ({title, items}) => (
    <div className={s.megaDropdown}>
        <div className={s.dropdownTitle}>{title}</div>
        <ul className={s.dropdownList}>
            {items.map((item, index) => (
                <MenuItem key={index} to={item.link}>{item.label}</MenuItem>
            ))}
        </ul>
    </div>
);

const Menu = () => {
    const userMenuItems = [
        {label: 'Профиль', link: '/profile'},
        {label: 'Настройки', link: '/settings'},
        {label: 'Выход', link: '/logout'},
    ];

    const catalogItems = [
        {label: 'О нас', link: '/about'},
        {label: 'Контакты', link: '/contact'},
    ];

    return (
        <header className={s.headerWrapper}>
            <div id="header" className={s.header}>
                <Link to="/" className={s.logo}></Link>
                <div className={s.catalog}>
                    <div className={s.catalogButton}>Каталог</div>
                    <MegaDropdown title="Каталог" items={catalogItems}/>
                </div>
                <form className={s.search} action="">
                    <input
                        className={s.searchInput}
                        name="q"
                        placeholder="Поиск..."
                        type="search"
                    />
                    <button className={s.searchButton}>Поиск</button>
                </form>
                <div className={s.menuItem}>
                    <div className={s.iconBook}></div>
                    <Link to="/" className={s.link}>Мои книги</Link>
                </div>
                <div className={`${s.userMenu} ${s.menuItem}`}>
                    <div className={s.iconUser}></div>
                    <Link to="/my-books" className={s.link}>Мои книги</Link>
                    <MegaDropdown title="Личный кабинет" items={userMenuItems}/>
                </div>
            </div>
        </header>
    );
};
export default Menu
