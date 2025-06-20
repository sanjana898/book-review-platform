// validations/user.validation.js
const { body, validationResult } = require('express-validator');

const userUpdateRules = () => [
  body('name').optional().isString().withMessage('name must be a string'),
  body('email').optional().isEmail().withMessage('invalid email'),
  body('bio').optional().isString(),
  body('password').optional().isLength({ min: 6 }).withMessage('password must be at least 6 chars'),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();
  const extracted = errors.array().map(err => ({ [err.param]: err.msg }));
  return res.status(422).json({ errors: extracted });
};

module.exports = { userUpdateRules, validate };
