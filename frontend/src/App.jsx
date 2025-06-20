import React, { useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';
import Home from './pages/Home';
import BookList from './pages/BookList';
import BookDetail from './pages/BookDetails';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import AddBook from './pages/AddBook';
import { setAuthToken } from './services/api';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setAuthToken(token);
  }, []); // Runs once on mount

  

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<BookList />} />
          <Route path="/books/:id" element={<BookDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/add-book" element={<AddBook />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
