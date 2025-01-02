import s from './AdminMenuPage.module.css'

const EditorMenu = () => {
    return (
        <div className={s.adminMenuContainer}>
            <p className={s.title}>Меню редактора</p>
            <div className={s.adminMenuButtons}>
                <div className={s.buttonsContainer}>
                    <button className={s.button}>Добавить статья</button>
                    <button className={s.button}>Редактировать статью</button>
                    <button className={s.button}>Удалить статью</button>
                </div>
            </div>
        </div>
    )
}

export default EditorMenu;