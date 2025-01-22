import { useEffect, useState } from 'react';
import s from './EditorMenu.module.css'
import AddArticleBlock from '../FunctionalWindows/AddArticleBlock/AddArticleBlock';
import EditArticleBlock from '../FunctionalWindows/EditArticleBlock/EditArticleBlock';
import RemoveArticleBlock from '../FunctionalWindows/RemoveArticleBlock/RemoveArticleBlock';
import { useNavigate } from 'react-router-dom';
import useApi from '../../../../api/ApiClient';
import { UserInfoRoleEnum } from '../../../../api';

const EditorMenu = () => {
    const { UserApi } = useApi();

    const navigate = useNavigate();
    const [isEditor, setIsEditor] = useState(false);
    
    useEffect(() => {
        UserApi.getAuthorizedUser()
            .then((response) => {
                if (response.user.role !== UserInfoRoleEnum.Editor) {
                    navigate('/');
                } else {
                    setIsEditor(true);
                }
            })
            .catch((error) => {
                console.error('Error fetching user data:', error);
                navigate('/');
            });
    }, [navigate]);

    const [activeWindowMenu, setActiveWindowMenu] = useState<string | null>(null);

    const handleButtonClick = (window: string) => setActiveWindowMenu(window); 

    const closeWindow = () => setActiveWindowMenu(null);

    if (!isEditor) return null;

    return (
        <div className={s.adminMenuContainer}>
            <p className={s.title}>Меню редактора</p>
            <div className={s.adminMenuButtons}>
                <div className={s.buttonsContainer}>
                    <button className={s.button} onClick={() => handleButtonClick('addArticle')}>Добавить статью</button>
                    <button className={s.button} onClick={() => handleButtonClick('editArticle')}>Редактировать статью</button>
                    <button className={s.button} onClick={() => handleButtonClick('removeArticle')}>Удалить статью</button>
                </div>
            </div>

            {activeWindowMenu === 'addArticle' && (
                <AddArticleBlock isOpen={activeWindowMenu} onClose={closeWindow}/>
            )}
            {activeWindowMenu === 'editArticle' && (
                <EditArticleBlock isOpen={activeWindowMenu} onClose={closeWindow}/>
            )}
            {activeWindowMenu === 'removeArticle' && (
                <RemoveArticleBlock isOpen={activeWindowMenu} onClose={closeWindow}/>
            )}
        </div>
    )
}

export default EditorMenu;