const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const { connectToDb } = require('./db/mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const User = require('./models/user');
const app = express();

// Load environment variables
require('dotenv').config();

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

app.use(express.static(path.join(__dirname, '../public')));
app.use(bodyParser.urlencoded({ extended: true }));

// Configure session middleware
app.use(session({
  secret: process.env.SECRET_KEY, // Use the secret key from the .env file
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URL, // Use mongoUrl option for connection
    ttl: 14 * 24 * 60 * 60, // Session TTL (optional)
    autoRemove: 'native' // Automatically remove expired sessions (optional)
  }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // Session expiration time (1 day)
}));

// Middleware to check if user is logged in
const requireLogin = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect('/common/login.html'); // Redirect to login page if not logged in
  }
  next();
};

// Connect to the database and start the server
connectToDb().then(() => {
  console.log("Database connection succeeded");

  // Route to handle signup
  app.post('/signup', async (req, res) => {
    const { name, email, psw } = req.body;

    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        console.log('User already exists with this email');
        return res.status(400).send('User already exists with this email');
      }

      // Create new user
      const newUser = new User({ name, email, psw });
      await newUser.save();
      console.log('User registered successfully!');

      // Initialize session after successful registration
      req.session.userId = newUser._id; // Store user id in session
      req.session.name = newUser.name;
      res.redirect('/'); // Redirect to profile page

    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).send('Registration failed. Please try again.');
    }
  });

  // Route to handle login
  app.post('/login', async (req, res) => {
    const { email, psw } = req.body;

    try {
      // Check if user exists
      const user = await User.findOne({ email, psw });

      if (!user) {
        console.log(email, psw)
        console.log('Invalid email or password');
        return res.status(400).send('Invalid email or password');
      }

      // Initialize session after successful login
      req.session.userId = user._id; // Store user id in session
      req.session.name = user.name; // Store user name in session
      res.redirect('/profile'); // Redirect to profile page

    } catch (error) {
      console.error('Error logging in user:', error);
      res.status(500).send('Login failed. Please try again.');
    }
  });

  // Route to handle logout
  app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Error logging out:', err);
        return res.status(500).send('Logout failed. Please try again.');
      }
      res.redirect('/'); // Redirect to login page
    });
  });

  // Example route protected by session (require login)
  app.get('/profile', requireLogin, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/common/profile.html'));
  });

  // Route to handle home page
  app.get('/', (req, res) => {
    const user = req.session.userId ? { id: req.session.userId, name: req.session.name } : null;
    res.render('index', { user });
    console.log(user);
  });

  // Start the server
  app.listen(3000, '0.0.0.0', () => {
    console.log("Server listening on port 3000");
  });

}).catch(err => {
  console.error("Database connection error:", err);
});

// Gracefully handle shutdown to close database connection
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
    process.exit(0);
  } catch (err) {
    console.error("Error closing MongoDB connection", err);
    process.exit(1);
  }
});
