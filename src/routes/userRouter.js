const express = require('express');
const path = require('path');
const User = require('../models/user');

const router = express.Router();

// Middleware to protect routes
const requireLogin = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  next();
};

// Signup form page
router.get('/signup', (req, res) => {
  res.render('signup');
});

// Handle signup POST
router.post('/signup', async (req, res) => {
  const { name, email, psw } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send('User already exists with this email');
    }
    const newUser = new User({ name, email, psw });
    await newUser.save();
    req.session.userId = newUser._id;
    req.session.name = newUser.name;
    res.redirect('/profile');
  } catch (err) {
    console.error(err);
    res.status(500).send('Registration failed. Please try again.');
  }
});

// Login form page
router.get('/login', (req, res) => {
  res.render('login');
});

// Handle login POST
router.post('/login', async (req, res) => {
  const { email, psw } = req.body;
  try {
    const user = await User.findOne({ email, psw });
    if (!user) {
      return res.status(400).send('Invalid email or password');
    }
    req.session.userId = user._id;
    req.session.name = user.name;
    res.redirect('/profile');
  } catch (err) {
    console.error(err);
    res.status(500).send('Login failed. Please try again.');
  }
});

// Profile page (protected)
router.get('/profile', requireLogin, (req, res) => {
  res.sendFile(path.join(__dirname, '../public/common/profile.html'));
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error(err);
      return res.status(500).send('Logout failed.');
    }
    res.redirect('/login');
  });
});

module.exports = router;
