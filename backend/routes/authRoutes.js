const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, bio } = req.body;
    if (await User.findOne({ email })) {
      return res.status(400).json({ error: 'Email already in use' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, bio });
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token, userId: user._id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ error: 'Invalid credentials' });

   const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    algorithm: 'HS256',
  });
  

   res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    maxAge: 3600 * 1000 // 1 hour in milliseconds
});
    res.json({ token, userId: user._id });
  

  // Send a response confirming login success
  //res.json({ message: 'Logged in' });
});

router.put('/users/:id', async (req, res) => {
  console.log("in the put api")
  try {
    console.log("in the try block");
    const updates = req.body;
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.params.id },
      updates,
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


module.exports = router;
