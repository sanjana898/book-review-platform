const express = require('express');
const router = express.Router();
const { userUpdateRules, validate } = require('../validations/user.validation');
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

// GET /api/users/:id
router.get('/:id', userController.getUserById);

// PUT /api/users/:id
router.put('/:id', auth, userUpdateRules(), validate, userController.updateUser);

module.exports = router;
