import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import s from './app.module.css';
import Footer from './component/Footer/Footer.tsx';
import Header from './component/Header/Header.tsx';
import AuthorPage from './pages/AuthorPage/AuthorPage.tsx';
import AdminMenu from './pages/AdminPages/AdminMenu/AdminMenu.tsx';
import EditorMenu from './pages/AdminPages/EditorMenu/EditorMenu.tsx';
import ArticlePage from './pages/ArticlePage/ArticlePage.tsx';
import BookPage from './pages/BookPage/BookPage.tsx';
import MainPage from './pages/MainPage/MainPage.tsx';
import ProfilePage from './pages/ProfilePage/ProfilePage.tsx';
import UserLibraryPage from './pages/UserLibraryPage/UserLibraryPage.tsx';
import GenrePage from './pages/GenrePage/GenrePage.tsx';
import ArticlesPage from './pages/ArticlesPage/ArticlesPage.tsx';
import SearchPage from './pages/SearchPage/SearchPage.tsx';
import AuthPage from './pages/AuthPage/AuthPage.tsx';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './component/ProtectedRoute/ProtectedRoute';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <div className={s.container}>
          <Routes>
            <Route path="/login" element={<AuthPage />} />
            <Route path="/" element={<MainPage />} />
            <Route path="/book/:id" element={<BookPage />} />
            <Route path="/admin" element={<ProtectedRoute><AdminMenu /></ProtectedRoute>} />
            <Route path="/editor" element={<ProtectedRoute><EditorMenu /></ProtectedRoute>} />
            <Route path="/author/:id" element={<AuthorPage />} />
            <Route path="/article/:id" element={<ArticlePage />} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/library" element={<ProtectedRoute><UserLibraryPage /></ProtectedRoute>} />
            <Route path="/genre/:genreID" element={<GenrePage />} />
            <Route path="/articles" element={<ArticlesPage />} />
            <Route path="/search" element={<SearchPage />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </AuthProvider>
  );
};

export default App;