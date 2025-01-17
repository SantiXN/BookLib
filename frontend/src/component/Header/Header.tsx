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

const catalogItems = [
    { id: 1, label: 'Статьи', link: '/genre/articles-1' },
    { id: 2, label: 'Романы', link: '/genre/novels' },
    { id: 3, label: 'Фэнтези', link: '/genre/fantasy' },
    { id: 4, label: 'Фантастика', link: '/genre/sci-fi' },
    { id: 5, label: 'Классика', link: '/genre/classic' },
    { id: 6, label: 'Мистика', link: '/genre/mystery' },
    { id: 7, label: 'Детективы', link: '/genre/detective' },
];

const Header = () => {
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
                    <Link to="/library" className={s.link}>
                        <div className={s.iconBook} />
                        Мои книги
                    </Link>
                </div>

                <div className={`${s.userMenu} ${s.menuItem} ${s.headerWrapperItem}`}>
                    <div className={s.iconUser} />
                    <Link to="/profile" className={s.link}>
                        Профиль
                    </Link>
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
