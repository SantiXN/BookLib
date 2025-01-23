import { Link } from 'react-router-dom';
import s from './Header.module.css';
import SearchBar from "../common/SearchBar/SearchBar";
import { useAuth } from '../../context/AuthContext';
import { BookCategories } from '../../utils/CategoryUtils';

const HeaderItem = ({ children, to }: { children: React.ReactNode, to: string }) => (
    <li>
        <Link to={to} className={s.menuItem}>{children}</Link>
    </li>
);

const MegaDropdown = ({ items }: { items: { id: number, label: string }[] }) => (
    <div className={s.megaDropdown}>
        <ul className={s.dropdownList}>
            {items.map((item, index) => (
                <HeaderItem key={index} to={`${item.id != 0 ? '/genre/' + item.id : '/articles'}`}>{item.label}</HeaderItem>
            ))}
        </ul>
    </div>
);

const Header = () => {
    const {isAuthenticated} = useAuth();

    if (!isAuthenticated) return null;

    return (
        <header className={s.headerWrapper}>
            <div id="header" className={s.header}>
                <Link to='/'>
                    <div className={`${s.logo} ${s.headerWrapperItem}`} />
                </Link>
                <div className={`${s.catalog} ${s.headerWrapperItem}`}>
                    <div className={s.catalogButton}>Каталог</div>
                    <MegaDropdown items={BookCategories} />
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
                    <Link to="/profile" className={s.link}>
                        <div className={s.iconUser} />
                        Профиль
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Header;
