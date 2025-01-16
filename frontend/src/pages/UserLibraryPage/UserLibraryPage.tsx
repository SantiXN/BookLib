import { useState } from 'react';
import s from './UserLibraryPage.module.css'
import BookCard from '../../component/common/BookCard/BookCard';

const UserLibraryPage = () => {
    const [selectedMenuItem, setSelectedMenuItem] = useState<string>('inProgress');

    const handleMenuItemClick = (item: string) => {
        setSelectedMenuItem(item);
    };

    return (
        <div className={s.libraryContainer}>
            <div>
            <p className={s.title}>Мои книги</p>
                <div className={s.library}>
                    <div className={s.libraryMenu}>
                        <div
                            className={`${s.libraryMenuItem} ${selectedMenuItem === 'inProgress' ? s.libraryMenuSelectedItem : ''}`}
                            onMouseDown={() => { selectedMenuItem != 'inProgress' && handleMenuItemClick('inProgress') }}
                        >
                            Читаемые
                        </div>
                        <div
                            className={`${s.libraryMenuItem} ${selectedMenuItem === 'planned' ? s.libraryMenuSelectedItem : ''}`}
                            onMouseDown={() => { selectedMenuItem != 'planned' && handleMenuItemClick('planned') }}
                        >
                            К прочтению
                        </div>
                        <div
                            className={`${s.libraryMenuItem} ${selectedMenuItem === 'finished' ? s.libraryMenuSelectedItem : ''}`}
                            onMouseDown={() => { selectedMenuItem != 'finished' && handleMenuItemClick('finished') }}
                        >
                            Прочитанные
                        </div>
                    </div>
                    <div className={s.libraryBooksContainer}>
                        <div className={s.libraryBooksBodyContainer}>
                            <BookCard 
                                title='Test'
                                author='Test'
                                coverImage='test'
                                rating={4}
                                toDirect='/book/0'
                                classname={s.libraryBookCard}
                            />
                            <BookCard 
                                title='Test'
                                author='Test'
                                coverImage='test'
                                rating={4}
                                toDirect='/book/0'
                                classname={s.libraryBookCard}
                            />
                            <BookCard 
                                title='Test'
                                author='Test'
                                coverImage='test'
                                rating={4}
                                toDirect='/book/0'
                                classname={s.libraryBookCard}
                            />
                            <BookCard 
                                title='Test'
                                author='Test'
                                coverImage='test'
                                rating={4}
                                toDirect='/book/0'
                                classname={s.libraryBookCard}
                            />
                            <BookCard 
                                title='Test'
                                author='Test'
                                coverImage='test'
                                rating={4}
                                toDirect='/book/0'
                                classname={s.libraryBookCard}
                            />
                            <BookCard 
                                title='Test'
                                author='Test'
                                coverImage='test'
                                rating={4}
                                toDirect='/book/0'
                                classname={s.libraryBookCard}
                            />
                            <BookCard 
                                title='Test'
                                author='Test'
                                coverImage='test'
                                rating={4}
                                toDirect='/book/0'
                                classname={s.libraryBookCard}
                            />
                            <BookCard 
                                title='Test'
                                author='Test'
                                coverImage='test'
                                rating={4}
                                toDirect='/book/0'
                                classname={s.libraryBookCard}
                            />
                            <BookCard 
                                title='Test'
                                author='Test'
                                coverImage='test'
                                rating={4}
                                toDirect='/book/0'
                                classname={s.libraryBookCard}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserLibraryPage;