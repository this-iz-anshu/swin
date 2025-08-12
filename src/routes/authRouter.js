const express = require('express');
const User = require('../models/user');
const router = express.Router();

// Signup page (GET)
router.get('/signup', (req, res) => {
  res.render('signup');
});

// Signup handler (POST)
router.post('/signup', async (req, res) => {
  const { name, email, psw } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.send('User already exists with this email');
    }
    const newUser = new User({ name, email, psw });
    await newUser.save();
    req.session.userId = newUser._id;
    req.session.name = newUser.name;
    res.redirect('/profile');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error signing up');
  }
});

// Login page (GET)
router.get('/login', (req, res) => {
  res.render('login');
});

// Login handler (POST)
router.post('/login', async (req, res) => {
  const { email, psw } = req.body;
  try {
    const user = await User.findOne({ email, psw });
    if (!user) {
      return res.send('Invalid email or password');
    }
    req.session.userId = user._id;
    req.session.name = user.name;
    res.redirect('/profile');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error logging in');
  }
});

// Logout route
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send('Logout failed');
    }
    res.redirect('/login');
  });
});

module.exports = router;
