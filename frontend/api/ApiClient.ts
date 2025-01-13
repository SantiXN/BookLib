import { Configuration, BookApi, AuthorApi, CategoryApi, UserApi } from '.'; // Путь к сгенерированному API

// Конфигурация клиента
// localStorage.setItem('token', 'mock-token');
// console.log('Token:', localStorage.getItem('token'));
const config = new Configuration({
  basePath: 'http://127.0.0.1:4010',
  headers: {
    Authorization: `Bearer mock-token}`, //${localStorage.getItem('token') || ''
  },
});
// Инициализация API клиента
const BookApiClient = new BookApi(config);
const AuthorApiClient = new AuthorApi(config);
const CategoryApiClient = new CategoryApi(config);
const UserApiClient = new UserApi(config);
export { BookApiClient, AuthorApiClient, CategoryApiClient, UserApiClient };