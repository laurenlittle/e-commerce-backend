const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

// Import Routes
const userRoutes = require('./routes/user');

// app
const app = express();

// db
mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useCreateIndex: true
}).then(() => {
  console.log('DB Connected');
})

// Routes Middleware
app.use('/api', userRoutes);

// Node JS has process
const port = process.env.PORT || 8000

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
})