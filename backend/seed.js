const mongoose = require('mongoose');
const Book = require('./models/Books'); // adjust path if necessary

const MONGO_URI = 'mongodb://127.0.0.1:27017/book_review_db'; // replace with your actual DB and port

const sampleBooks = [
  {
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    genre: 'Fiction',
    rating: 4.8,
    featured: true,
    description: 'A novel about racial injustice in the Deep South.',
  },
  {
    title: '1984',
    author: 'George Orwell',
    genre: 'Dystopian',
    rating: 4.7,
    featured: true,
    description: 'A dystopian critique of totalitarianism.',
  },
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    genre: 'Fiction',
    rating: 4.4,
    featured: false,
    description: 'The jazz age story of Jay Gatsby and his love for Daisy.',
  },
  {
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    genre: 'Romance',
    rating: 4.6,
    featured: false,
    description: 'A classic novel about manners, upbringing, and marriage.',
  },
  {
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    genre: 'Fantasy',
    rating: 4.7,
    featured: true,
    description: 'Bilbo Baggins sets out on a journey with a band of dwarves.',
  },
];

async function seed() {
  await mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('🔗 Connected to DB');

  await Book.deleteMany({});
  console.log('✅ Cleared existing books');

  await Book.insertMany(sampleBooks);
  console.log('📚 Inserted sample books');
  
  mongoose.disconnect();
}

seed().catch((err) => {
  console.error('❌ Seed error:', err);
  mongoose.disconnect();
});
