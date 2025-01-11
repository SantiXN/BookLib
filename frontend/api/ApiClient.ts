import { Configuration, BookApi } from '.'; // Путь к сгенерированному API

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
const ApiClient = new BookApi(config);
export default ApiClient;