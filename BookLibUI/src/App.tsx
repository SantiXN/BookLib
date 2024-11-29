import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import s from './app.module.css';
import Footer from '../src/component/Footer/Footer.tsx'
import MainPage from './pages/MainPage/MainPage.tsx';
import Header from './component/common/Header/Header.tsx';

const PersonalAccount = () => {
    return (
        <div>
            <h1>Личный кабинет</h1>
            {/* Контент личного кабинета */}
        </div>
    );
};

const Book = () => {
    return (
        <div>
            <h1>Книга ID: </h1>
            {/* Дополнительная информация о книге */}
        </div>
    );
};

const Info = () => {
    return (
        <div>
            <h1>Информация</h1>
            {/* Информация о приложении или другие детали */}
        </div>
    );
};

const AdminEditor = () => {
    return (
        <div>
            <h1>Административная панель</h1>
            {/* Функции для администрирования */}
        </div>
    );
};

const App = () => {
  return (
      <Router>
        <Header />
          <div className={s.container}>
              <Routes>
                  <Route path="/account" element={<PersonalAccount />} />
                  <Route path="/book/:id" element={<Book />} />
                  <Route path="/info" element={<Info />} />
                  <Route path="/admin" element={<AdminEditor />} />
              </Routes>

        <MainPage></MainPage>
          </div>
        <Footer />
      </Router>
  );
};


export default App
