import { useEffect, useState } from 'react';
import { Configuration, BookApi, AuthorApi, CategoryApi, UserApi, ArticleApi, FileApi } from '.';

// Функция для создания конфигурации клиента
const createConfig = (token: string) => new Configuration({
  basePath: 'http://localhost:8080',
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

// Хук для отслеживания токена в localStorage
const useApi = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  useEffect(() => {
    // Слушаем изменения в localStorage
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'token') {
        setToken(localStorage.getItem('token')); // Обновляем токен из localStorage
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Пересоздаем клиентов при изменении токена
  const config = createConfig(token || '');

  const BookApiClient = new BookApi(config);
  const AuthorApiClient = new AuthorApi(config);
  const CategoryApiClient = new CategoryApi(config);
  const UserApiClient = new UserApi(config);
  const ArticleApiClient = new ArticleApi(config);
  const FileApiClient = new FileApi(config);

  return { BookApi: BookApiClient, AuthorApi: AuthorApiClient, CategoryApi: CategoryApiClient, UserApi: UserApiClient, ArticleApi: ArticleApiClient, FileApi: FileApiClient };
};

export default useApi;
