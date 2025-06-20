const Review = require('../models/Review');

exports.getReviews = async (req, res) => {
  try {
    const { bookId } = req.query;
    if (!bookId) {
      return res.status(400).json({ error: "Book ID is required" });
    }

    const reviews = await Review.find(bookId ? { bookId } : {});
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addReview = async (req, res) => {
  try {
    const review = new Review(req.body);
    const saved = await review.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
