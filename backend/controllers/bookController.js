const Book = require('../models/Books');

// GET /books
// exports.getAllBooks = async (req, res) => {
//   try {
//     const books = await Book.find(); // Add pagination later
//     res.json(books);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

exports.getAllBooks = async (req, res) => {
  try {
    // 1️⃣ Filtering — build filter object from query, excluding control params
    const filter = { ...req.query };
    ['page', 'limit', 'sort'].forEach(p => delete filter[p]);

    // Support operators like rating[gte]=4
    let filterStr = JSON.stringify(filter).replace(/\b(gte|gt|lte|lt)\b/g, m => `$${m}`);
    const parsedFilter = JSON.parse(filterStr);


    // 2️⃣ Build Mongoose query
    let query = Book.find(parsedFilter);

    // 3️⃣ Sorting — ?sort=rating,-title
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // 4️⃣ Pagination — default page=1, limit=10
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    // 5️⃣ Execute and count total
    const [books, total] = await Promise.all([
      query.exec(),
      Book.countDocuments(parsedFilter)
    ]);

    // 6️⃣ Respond with metadata
    res.json({
      total,
      page,
      totalPages: Math.ceil(total / limit),
      books
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /books/:id
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /books (admin only)
exports.addBook = async (req, res) => {
  try {
    const newBook = new Book(req.body);
    const saved = await newBook.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
