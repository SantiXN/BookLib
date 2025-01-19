import { Configuration, BookApi, AuthorApi, CategoryApi, UserApi, ArticleApi } from '.'; 
// Конфигурация клиента
const token = localStorage.getItem('token') || '';
const config = new Configuration({
  basePath: 'http://localhost:8080',
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

// Инициализация API клиента
const BookApiClient = new BookApi(config);
const AuthorApiClient = new AuthorApi(config);
const CategoryApiClient = new CategoryApi(config);
const UserApiClient = new UserApi(config);
const ArticleApiClient = new ArticleApi(config);

export { BookApiClient, AuthorApiClient, CategoryApiClient, UserApiClient, ArticleApiClient };