const express = require('express');
const app = express();

require('dotenv').config();

// Node JS has process
const port = process.env.PORT || 8000

app.get('/', (req, res) => {
  res.send('hello from node');
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
})