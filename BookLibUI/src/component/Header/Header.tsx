import {Link} from "react-router-dom";
import s from './Header.module.css'
import SearchBar from "../common/SearchBar/SearchBar";
import { useState } from "react";
import AuthMenu from "../AuthMenu/AuthMenu";

const HeaderItem = ({children, to}) => (
    <li>
        <Link to={to} className={s.menuItem}>{children}</Link>
    </li>
);

const MegaDropdown = ({title, items}) => (
    <div className={s.megaDropdown}>
        <div className={s.dropdownTitle}>{title}</div>
        <ul className={s.dropdownList}>
            {items.map((item, index) => (
                <HeaderItem key={index} to={item.link}>{item.label}</HeaderItem>
            ))}
        </ul>
    </div>
);

const Header = () => {
    const userMenuItems = [
        {label: 'Профиль', link: '/profile'},
        {label: 'Настройки', link: '/settings'},
        {label: 'Выход', link: '/logout'},
    ];

    const catalogItems = [
        {label: 'Статьи', link: '/about'},
        {label: 'Романы', link: '/about'},
        {label: 'Фэнтези', link: '/about'},
        {label: 'Фантастика', link: '/about'},
        {label: 'Классика', link: '/about'},
        {label: 'Мистика', link: '/contact'},
        {label: 'Детективы', link: '/contact'},
    ];

    const [isAuthMenuOpen, setIsAuthMenuOpen] = useState(false);

    const openAuthMenu = () => setIsAuthMenuOpen(true);
    const closeAuthMenu = () => setIsAuthMenuOpen(false);

    // последний элемент в блоке - для тестирования окна авторизации
    // Окно авторизации должно всплывать при клике на иконку профиля
    return (
        <header className={s.headerWrapper}>
            <div id="header" className={s.header}>
                <div className={`${s.logo} ${s.headerWrapperItem}`}>
                    <Link to="/"></Link>
                </div>
                <div className={`${s.catalog} ${s.headerWrapperItem}`}>
                    <div className={s.catalogButton}>Каталог</div>
                    <MegaDropdown title="Каталог" items={catalogItems}/>
                </div>
                <div className={s.headerWrapperItem}>
                    <SearchBar></SearchBar>
                </div>
                <div className={`${s.menuItem} ${s.headerWrapperItem}`}>
                    <div className={s.iconBook}></div>
                    <Link to="/" className={s.link}>Мои книги</Link>
                </div>
                <div className={`${s.userMenu} ${s.menuItem} ${s.headerWrapperItem}`}>
                    <div className={s.iconUser}></div>
                    <Link to="/my-books" className={s.link}>Профиль</Link>
                    <MegaDropdown title="Профиль" items={userMenuItems}/>
                </div>
                <div className={s.headerWrapperItem}>
                    <button onClick={openAuthMenu}>
                        Авторизоваться
                    </button>
                    <AuthMenu isOpen={isAuthMenuOpen} onClose={closeAuthMenu} />
                </div>
            </div>
        </header>
    );
};
export default Header;
