const User = require('../models/user');
const bcryptService = require('../services/bcryptService');

// Register a new user
exports.register = async (req, res) => {
  try {
    // Handle Multer file filter errors
    if (req.fileValidationError) {
      return res.status(400).json({ error: req.fileValidationError });
    }
    if (req.error && req.error.code === 'DUPLICATE_BASE_NAME') {
      return res.status(400).json({ error: req.error.message });
    }

    const { name, email, password } = req.body;
    let image_url = null;

    // If an image was uploaded, construct its URL
    if (req.file) {
      image_url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Hash the password
    const hashedPassword = await bcryptService.hashPassword(password);

    // Create new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      image_url
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        image_url: newUser.image_url
      }
    });
  } catch (error) {
    // Handle Multer duplicate base name error
    if (error.code === 'DUPLICATE_BASE_NAME') {
      return res.status(400).json({ error: error.message });
    }
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Login a user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    const isMatch = await bcryptService.comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    // Set user info in session
    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      image_url: user.image_url
    };
    res.status(200).json({
      message: 'Login successful',
      user: req.session.user
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 