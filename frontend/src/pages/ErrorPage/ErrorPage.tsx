import s from './ErrorPage.module.css';
import {Link} from 'react-router-dom';
const ErrorPage = () => {

    const handleBack = () => {
        window.history.back();
    };

    return (
        <div className={s.errorContainer}>
            <div className={s.errorCode}>404</div>
            <div className={s.errorMessage}>Извините, такой страницы нет</div>
            <div className={s.errorDescription}>Попробуйте вернуться назад и повторить еще раз или начните с главной</div>
            <button onClick={handleBack} className={`${s.button}`}>Назад</button>
            <Link to='/' className={`${s.button}`}>На главную</Link>
        </div>
    );
};

export default ErrorPage;