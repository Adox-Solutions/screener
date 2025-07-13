const User = require('../models/user');
const bcryptService = require('../services/bcryptService');

// Helper to check if request expects JSON
function expectsJson(req) {
  return req.xhr || req.headers.accept.indexOf('json') > -1;
}

// Register a new user
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let image_url = null;

    if (req.file) {
      image_url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      if (expectsJson(req)) {
        return res.status(400).json({ error: 'User already exists with this email' });
      } else {
        return res.redirect('/register?error=exists');
      }
    }

    const hashedPassword = await bcryptService.hashPassword(password);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      image_url
    });

    if (expectsJson(req)) {
      res.status(201).json({
        message: 'User registered successfully',
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          image_url: newUser.image_url
        }
      });
    } else if (req.body.from_admin) {
      res.redirect('/users');
    } else {
      res.redirect('/login');
    }
  } catch (error) {
    if (expectsJson(req)) {
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.redirect('/register?error=server');
    }
  }
};

// Login a user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      if (expectsJson(req)) {
        return res.status(400).json({ error: 'Invalid email or password' });
      } else {
        return res.redirect('/login?error=invalid');
      }
    }
    const isMatch = await bcryptService.comparePassword(password, user.password);
    if (!isMatch) {
      if (expectsJson(req)) {
        return res.status(400).json({ error: 'Invalid email or password' });
      } else {
        return res.redirect('/login?error=invalid');
      }
    }
    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      image_url: user.image_url
    };
    if (expectsJson(req)) {
      res.status(200).json({
        message: 'Login successful',
        user: req.session.user
      });
    } else {
      res.redirect('/home');
    }
  } catch (error) {
    if (expectsJson(req)) {
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.redirect('/login?error=server');
    }
  }
}; 