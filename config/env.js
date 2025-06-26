const dotenv = require('dotenv');
const env = process.env.NODE_ENV;
if (env === 'production') {
  dotenv.config({ path: '.env.production' });
} else if (env === 'staging') {
  dotenv.config({ path: '.env.staging' });
} else {
  dotenv.config();
} 