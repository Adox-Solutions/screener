// routes/auth.js

const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');
const upload = require('../middleware/upload');

// Register a new user with image upload
router.post('/register', upload.single('image'), authController.register);

// Login a user
router.post('/login', authController.login);

module.exports = router; 