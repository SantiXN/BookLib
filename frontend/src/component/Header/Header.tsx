import { Link } from 'react-router-dom';
import s from './Header.module.css';
import SearchBar from "../common/SearchBar/SearchBar";
import { useState } from "react";
import AuthMenu from "../AuthMenu/AuthMenu";

const HeaderItem = ({ children, to }: { children: React.ReactNode, to: string }) => (
    <li>
        <Link to={to} className={s.menuItem}>{children}</Link>
    </li>
);

const MegaDropdown = ({ items }: { items: { label: string, link: string }[] }) => (
    <div className={s.megaDropdown}>
        <ul className={s.dropdownList}>
            {items.map((item, index) => (
                <HeaderItem key={index} to={item.link}>{item.label}</HeaderItem>
            ))}
        </ul>
    </div>
);

const Header = () => {
    const userMenuItems = [
        { label: 'Профиль', link: '/profile' },
        { label: 'Настройки', link: '/admin' },
        { label: 'Выход', link: '/logout' },
    ];

    const catalogItems = [
        { label: 'Статьи', link: '/article' },
        { label: 'Романы', link: '/novels' },
        { label: 'Фэнтези', link: '/fantasy' },
        { label: 'Фантастика', link: '/sci-fi' },
        { label: 'Классика', link: '/classic' },
        { label: 'Мистика', link: '/mystery' },
        { label: 'Детективы', link: '/detective' },
    ];

    const [isAuthMenuOpen, setIsAuthMenuOpen] = useState(false);

    const openAuthMenu = () => setIsAuthMenuOpen(true);
    const closeAuthMenu = () => setIsAuthMenuOpen(false);

    return (
        <header className={s.headerWrapper}>
            <div id="header" className={s.header}>
                <Link to='/'>
                    <div className={`${s.logo} ${s.headerWrapperItem}`} />
                </Link>
                <div className={`${s.catalog} ${s.headerWrapperItem}`}>
                    <div className={s.catalogButton}>Каталог</div>
                    <MegaDropdown items={catalogItems} />
                </div>

                <div className={s.headerWrapperItem}>
                    <SearchBar />
                </div>

                <div className={`${s.menuItem} ${s.headerWrapperItem}`}>
                    <div className={s.iconBook}></div>
                    <Link to="/editor" className={s.link}>Мои книги</Link>
                </div>

                <div className={`${s.userMenu} ${s.menuItem} ${s.headerWrapperItem}`}>
                    <div className={s.iconUser} />
                    <Link to="/admin" className={s.link}>Профиль</Link>
                    <MegaDropdown items={userMenuItems} />
                </div>

                <div className={s.headerWrapperItem}>
                    <button onClick={openAuthMenu} className={s.authButton}>
                        Авторизоваться
                    </button>
                    <AuthMenu isOpen={isAuthMenuOpen} onClose={closeAuthMenu} />
                </div>
            </div>
        </header>
    );
};

export default Header;
