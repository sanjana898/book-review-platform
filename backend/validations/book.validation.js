// validations/book.validation.js
const { body, validationResult } = require('express-validator');

const bookRules = () => [
  body('title').notEmpty().withMessage('Title is required').isString(),
  body('author').notEmpty().withMessage('Author is required').isString(),
  body('genre').optional().isString(),
  body('featured').optional().isBoolean(),
  body('rating').optional().isFloat({ min: 0, max: 5 }).withMessage('Rating must be between 0 and 5'),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  const extracted = errors.array().map(err => ({ [err.param]: err.msg }));
  return res.status(422).json({ errors: extracted });
};

module.exports = { bookRules, validate };
