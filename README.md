# 📚 Book Review Platform

A full-stack web application to discover books, add reviews, and manage user profiles. Built with a Node.js & Express backend, MongoDB for storage, and a React + Vite frontend.

---

## 🧩 Technologies

- **Backend**: Node.js, Express, Mongoose, JWT, bcrypt
- **Database**: MongoDB
- **Frontend**: React, Vite, Tailwind CSS, react-router-dom, react-hot-toast, lucide-react
- **Auth**: JWT for protected endpoints
  

---

## 🛠️ Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [npm](https://www.npmjs.com/)
- MongoDB Atlas account or local MongoDB instance
- Optional but recommended: [Git](https://git-scm.com/)

---

## 🚀 Setup Guide

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/book-review-platform.git
cd book-review-platform
```

### 2. Backend Setup

cd backend

npm install

#### Create a .env file or set environment variables: 

env: MONGO_URI=<your-mongo-connection-string>
JWT_SECRET=<your-jwt-secret>
JWT_EXPIRES_IN=1h
NODE_ENV=development
PORT=5001


Start the server: npm run dev or npm start

Your backend will be running at http://localhost:5001/api

### 3. Frontend Setup

cd ../frontend
npm install
Create a .env file (or modify vite.config.js accordingly):

env:
VITE_API_BASE_URL=http://localhost:5001/api

Run the frontend in development mode: npm run dev

Visit http://localhost:5173 (or the URL shown by Vite).

## 🔐 Authentication Flow
Register via POST /api/auth/register → receives JWT token

Login via POST /api/auth/login → cookie + token

Protected routes (e.g., update profile, add review) require JWT in Authorization header

## 🔁 Deployment Tips
Backend (Render / Heroku)
Add MONGO_URI and JWT_SECRET in environment settings

Use Dockerfile or Node build as per provider docs

Ensure process.env.PORT is used

Frontend (Vercel / Netlify)
Add VITE_API_BASE_URL in environment settings

Build using npm run build

## 📚 API Overview
Auth
POST /api/auth/register – option: { name, email, password, bio }

POST /api/auth/login – { email, password }, returns JWT token

Books
GET /api/books – supports filters: ?page=1&limit=12&genre=Fiction&sort=-rating

GET /api/books/:id

POST /api/books (admin only)

Reviews
GET /api/reviews?bookId={id}

POST /api/reviews (JWT required) – { bookId, rating, comment }

Users
PUT /api/users/:id (JWT) – update profile

## ✅ Contributing
Contributions, issues, and feature requests are welcome!
