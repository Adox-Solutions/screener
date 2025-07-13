const Screen = require('../models/screen');

exports.createScreen = async (req, res) => {
  try {
    const { name } = req.body;
    let image_url = null;
    if (req.file) {
      image_url = `/uploads/${req.file.filename}`;
    }
    const screen = await Screen.create({ name, image_url });
    res.status(201).json(screen);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllScreens = async (req, res) => {
  try {
    const screens = await Screen.findAll();
    res.json(screens);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getScreenById = async (req, res) => {
  try {
    const screen = await Screen.findByPk(req.params.id);
    if (!screen) return res.status(404).json({ error: 'Screen not found' });
    res.json(screen);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateScreen = async (req, res) => {
  try {
    const { name, image_url } = req.body;
    const screen = await Screen.findByPk(req.params.id);
    if (!screen) return res.status(404).json({ error: 'Screen not found' });
    screen.name = name ?? screen.name;
    screen.image_url = image_url ?? screen.image_url;
    await screen.save();
    res.json(screen);
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: error.message });
  }
};

exports.deleteScreen = async (req, res) => {
  try {
    const screen = await Screen.findByPk(req.params.id);
    if (!screen) return res.status(404).json({ error: 'Screen not found' });
    await screen.destroy();
    res.json({ message: 'Screen deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 