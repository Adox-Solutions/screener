require('./config/env');
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SECRET_KEY, // use a strong secret in production
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'development',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  }
}));

const commonRoutes = require('./routes/common');
app.use('/', commonRoutes);

const screenRoutes = require('./routes/screen');
app.use('/screens', screenRoutes);

const userRoutes = require('./routes/user');
app.use('/users', userRoutes);

const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

app.use('/uploads', express.static('uploads'));
app.use(express.static('public'));

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

module.exports = app; 