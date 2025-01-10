import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import s from './app.module.css';
import Footer from './component/Footer/Footer.tsx';
import Header from './component/Header/Header.tsx';
import AuthorPage from './pages/AuthorPage/AuthorPage.tsx';
import AdminMenu from './pages/AdminPages/AdminMenu/AdminMenu.tsx';
import EditorMenu from './pages/AdminPages/EditorMenu/EditorMenu.tsx';
import ArticlePage from './pages/ArticlePage/ArticlePage.tsx';
import BookCardPagePage from './pages/BookPage/BookCardPage.module.css';
import MainPage from './pages/MainPage/MainPage.tsx';


const App = () => {
  return (
      <Router>
        <Header />
          <div className={s.container}>
              <Routes>
                  <Route path="/" element={<MainPage />} />
                  <Route path="/book" element={<BookCardPagePage />} />
                  <Route path="/admin" element={<AdminMenu />} />
                  <Route path="/editor" element={<EditorMenu />} />
                  <Route path="/author" element={<AuthorPage />} />
                  <Route path="/article" element={<ArticlePage />} />
              </Routes>
          </div>
        <Footer />
      </Router>
  );
};


export default App
