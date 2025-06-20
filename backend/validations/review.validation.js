// validations/review.validation.js
const { body, validationResult } = require('express-validator');

const reviewRules = () => [
  body('bookId').exists().withMessage('bookId is required').isMongoId(),
  body('userId').exists().withMessage('userId is required').isMongoId(),
  body('rating').exists().withMessage('rating is required')
    .isInt({ min: 1, max: 5 }).withMessage('rating must be between 1 and 5'),
  body('comment').optional().isString(),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();
  const extracted = errors.array().map(err => ({ [err.param]: err.msg }));
  return res.status(422).json({ errors: extracted });
};

module.exports = { reviewRules, validate };
