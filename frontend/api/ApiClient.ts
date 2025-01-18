import { Configuration, BookApi, AuthorApi, CategoryApi, UserApi, ArticleApi } from '.'; 
// Конфигурация клиента
const token = localStorage.getItem('token') || '';
const config = new Configuration({
  basePath: 'http://127.0.0.1:4010',
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
console.log(config);

// Инициализация API клиента
const BookApiClient = new BookApi(config);
const AuthorApiClient = new AuthorApi(config);
const CategoryApiClient = new CategoryApi(config);
const UserApiClient = new UserApi(config);
const ArticleApiClient = new ArticleApi(config);

export { BookApiClient, AuthorApiClient, CategoryApiClient, UserApiClient, ArticleApiClient };