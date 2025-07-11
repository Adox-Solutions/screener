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
    const { name, email, image_url } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    user.name = name ?? user.name;
    user.email = email ?? user.email;
    user.image_url = image_url ?? user.image_url;
    await user.save();
    res.json({ message: 'User updated', user });
  } catch (error) {
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