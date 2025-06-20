// src/services/api.js
import axios from 'axios';


const api = axios.create({ baseURL: 'http://localhost:5001/api' });

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
}

const usersAPI = {
  update: (id, data) => api.put(`/users/${id}`, data),
  // you can also add get, delete, etc. if needed
};

const booksAPI = {
  getAll: (params) => api.get('/books', { params }),
  getById: (id) => api.get(`/books/${id}`),
};

const reviewsAPI = {
  getByBookId: (bookId) => api.get(`/reviews`, { params: { bookId: bookId } }),
  create: (bookId, data) => api.post(`/reviews`, { ...data, bookId: bookId }),
};



export { usersAPI, booksAPI, reviewsAPI}

export default api;

