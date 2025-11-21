const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
  console.log('Register endpoint hit with data:', req.body);
  const { username, email, password } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (userExists) {
      console.log('User already exists:', email, username);
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
    });

    if (user) {
      console.log('User created successfully:', user._id);
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      console.log('Invalid user data');
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  console.log('Login endpoint hit with data:', req.body);
  const { email, password } = req.body;

  try {
    // Check for user email
    const user = await User.findOne({ email });
    console.log('User lookup result:', user ? 'User found' : 'User not found');

    if (user && (await user.comparePassword(password))) {
      console.log('Login successful for user:', user._id);
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      console.log('Invalid credentials for email:', email);
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  console.log('Profile endpoint hit for user:', req.user ? req.user._id : 'No user');
  try {
    const user = await User.findById(req.user._id).select('-password');
    console.log('Profile retrieved for user:', user ? user._id : 'Not found');
    res.json(user);
  } catch (error) {
    console.error('Profile retrieval error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;