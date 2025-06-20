const express = require('express');
const router = express.Router();
const { reviewRules, validate } = require('../validations/review.validation');
const reviewController = require('../controllers/reviewController');
const auth = require('../middleware/auth');

// GET /api/reviews?bookId=...
router.get('/', reviewController.getReviews);

// POST /api/reviews
router.post('/',auth, reviewRules(), validate, reviewController.addReview);

module.exports = router;
