// app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

require('dotenv').config();

console.log('✅ JWT_SECRET loaded:', !!process.env.JWT_SECRET);


const connectDB = require('./config/db');


// Route imports
const bookRoutes = require('./routes/bookRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');


const app = express();

connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/books', bookRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use(cookieParser(process.env.COOKIE_SECRET || 'myCookieSecret123')); 



app.get('/', (req, res) => {
  res.send('📚 Book Review API is up and running!');
});


// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT, () =>
      console.log(`Server running on port ${process.env.PORT}`)
    );
  })
  .catch((err) => console.error(err));
