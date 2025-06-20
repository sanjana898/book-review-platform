const express = require('express');
const router = express.Router();
const Book = require('../models/Books');
const bookController = require('../controllers/bookController');
const { bookRules, validate } = require('../validations/book.validation');

// GET /api/books
router.get('/', bookController.getAllBooks);

// GET /api/books/:id
router.get('/:id', bookController.getBookById);

// POST /api/books
router.post('/', bookRules(), validate, bookController.addBook); // Later, secure with admin middleware

module.exports = router;
