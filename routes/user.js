// routes/user.js

const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const upload = require('../middleware/upload');

// Get all users
router.get('/', userController.getAllUsers);

// Get a user by ID
router.get('/:id', userController.getUser);
// Update a user by ID
router.put('/:id', upload.single('image'), userController.updateUser);
// Delete a user by ID
router.delete('/:id', userController.deleteUser);

module.exports = router; 