// Load environment variables from .env based on NODE_ENV
require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`
});

const fs = require('fs');
const path = require('path');

// Ensure 'uploads' directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
  console.log('Created missing "uploads/" directory.');
}

// Main entry point for the application
const PORT = process.env.PORT || 3000;
const app = require("./app");
const sequelize = require("./config/database");

// Load models
require("./models/user");
require("./models/screen");

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected.");
    await sequelize.sync();
    console.log("✅ Database synchronized.");

    app.listen(PORT, () => {
      console.log(`🌐 Server is running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
      console.log(`Database: ${process.env.DB_NAME}`);
    });
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
    process.exit(1);
  }
})();