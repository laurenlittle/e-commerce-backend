const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const morgan = require('morgan');
const expressValidator = require('express-validator');
require('dotenv').config();

// Import Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');

// app
const app = express();

// db
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true
}).then(() => {
  console.log('DB Connected');
})

// Middlewares
app.use(morgan('dev')); // HTTP request logger middleware for node.js
app.use(bodyParser.json()); // get the json data from request body
app.use(cookieParser()); // save user creds in cookie
app.use(expressValidator()); // validate user data on signup
app.use(cors()); // API can handle requests coming from different origin (i.e request from 3001 react to 8000 backend)

// Routes Middleware
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);

// Node JS has process
const port = process.env.PORT || 8000

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
})