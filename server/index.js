const express = require('express');
const morgan = require('morgan');
const routes = require('./routes');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(morgan('tiny'));

app.use('/', routes);

let port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
