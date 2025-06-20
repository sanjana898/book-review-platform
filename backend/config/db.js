// config/db.js
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/book_review_db', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // optional tuning:
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB connected: ${mongoose.connection.host}:${mongoose.connection.port}`);
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1); // stop the app if DB connection fails
  }

  mongoose.connection.on('error', err =>
    console.error('MongoDB runtime error:', err)
  );
};

module.exports = connectDB;
