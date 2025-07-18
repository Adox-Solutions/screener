const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

const Screen = sequelize.define('Screen', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  image_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  timestamps: true,
});

User.hasOne(Screen, { foreignKey: 'user_id' });
Screen.belongsTo(User, { foreignKey: 'user_id' });
module.exports = Screen; 