const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  console.log('Protect middleware hit, authorization header:', req.headers.authorization);
  let token;

  // Check for token in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
      console.log('Token extracted:', token);

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Token decoded:', decoded);

      // Get user from token
      req.user = await User.findById(decoded.id).select('-password');
      console.log('User found:', req.user ? req.user._id : 'Not found');

      next();
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };