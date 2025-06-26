const express = require('express');
const router = express.Router();
const screenController = require('../controller/screenController');
const upload = require('../middleware/upload');

// Create a new screen
router.post('/', upload.single('image'), screenController.createScreen);

// Get all screens
router.get('/', screenController.getAllScreens);

// Get a screen by id
router.get('/:id', screenController.getScreenById);

// Update a screen by id
router.put('/:id', screenController.updateScreen);

// Delete a screen by id
router.delete('/:id', screenController.deleteScreen);

module.exports = router; 