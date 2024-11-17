import './App.css'
import '../src/component/menu/menu.tsx'
import Menu from '../src/component/menu/menu.tsx'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const Main = () => {
    return (
        <div>
            <h1>Добро пожаловать на главную страницу!</h1>
            {/* Дополнительный контент */}
        </div>
    )
};

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
        <Menu />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/account" element={<PersonalAccount />} />
          <Route path="/book/:id" element={<Book />} />
          <Route path="/info" element={<Info />} />
          <Route path="/admin" element={<AdminEditor />} />
        </Routes>
      </Router>
  );
};


export default App
