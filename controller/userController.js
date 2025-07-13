const User = require('../models/user');
const Screen = require('../models/screen');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ['password'] } });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { name, email } = req.body || {};
    let image_url = null;

    // Handle file upload if present
    if (req.file) {
      image_url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update only provided fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (image_url) user.image_url = image_url;

    await user.save();
    res.json({ message: 'User updated', user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    // Delete associated screen if exists
    const screen = await Screen.findOne({ where: { user_id: user.id } });
    if (screen) {
      await screen.destroy();
    }
    await user.destroy();
    res.json({ message: 'User and associated screen deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}; 