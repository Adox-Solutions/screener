// Main entry point for the application
const PORT = process.env.PORT || 3000;
const app = require('./app');
const sequelize = require('./config/database');
require('./models/user');
require('./models/screen');


(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');
    await sequelize.sync();
    console.log('Database synchronized.');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
})();
