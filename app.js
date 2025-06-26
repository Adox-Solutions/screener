require('./config/env');
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const commonRoutes = require('./routes/common');
app.use('/', commonRoutes);

const screenRoutes = require('./routes/screen');
app.use('/screens', screenRoutes);

app.use('/uploads', express.static('uploads'));

module.exports = app; 