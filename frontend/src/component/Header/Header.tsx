import { Link } from 'react-router-dom';
import s from './Header.module.css';
import SearchBar from "../common/SearchBar/SearchBar";

const HeaderItem = ({ children, to }: { children: React.ReactNode, to: string }) => (
    <li>
        <Link to={to} className={s.menuItem}>{children}</Link>
    </li>
);

const MegaDropdown = ({ items }: { items: { id: number, label: string, link: string }[] }) => (
    <div className={s.megaDropdown}>
        <ul className={s.dropdownList}>
            {items.map((item, index) => (
                <HeaderItem key={index} to={`${item.link}${item.id != 1 ? '-' + item.id : ''}`}>{item.label}</HeaderItem>
            ))}
        </ul>
    </div>
);

const genres = [
    { id: 1, label: 'Статьи', link: '/articles' },
    { id: 2, label: 'Романы', link: '/genre/novels' },
    { id: 3, label: 'Фэнтези', link: '/genre/fantasy' },
    { id: 4, label: 'Фантастика', link: '/genre/scifi' },
    { id: 5, label: 'Классика', link: '/genre/classic' },
    { id: 6, label: 'Мистика', link: '/genre/mystery' },
    { id: 7, label: 'Детективы', link: '/genre/detective' },
];

const Header = () => {

    return (
        <header className={s.headerWrapper}>
            <div id="header" className={s.header}>
                <Link to='/'>
                    <div className={`${s.logo} ${s.headerWrapperItem}`} />
                </Link>
                <div className={`${s.catalog} ${s.headerWrapperItem}`}>
                    <div className={s.catalogButton}>Каталог</div>
                    <MegaDropdown items={genres} />
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
            </div>
        </header>
    );
};

export default Header;
