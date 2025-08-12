const express = require('express');
const path = require('path');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
require('dotenv').config();
const authRouter = require('./routes/authRouter');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Static files./userRouter
app.use(express.static(path.join(__dirname, '../public')));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));


// Sessions
app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    ttl: 14 * 24 * 60 * 60,
    autoRemove: 'native',
  }),
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

// Import user routes
const userRouter = require('./routes/userRouter');
app.use(userRouter);

// Homepage route (if you want separate from userRouter)
app.get('/', (req, res) => {
    const user = req.session.userId ? { id: req.session.userId, name: req.session.name } : null;
    res.render('index', { user });
  });

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}).catch(err => {
  console.error('MongoDB connection error:', err);
});
 
// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed');
  process.exit(0);
});
