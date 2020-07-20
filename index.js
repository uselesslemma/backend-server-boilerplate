const bodyParser = require('body-parser');
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const morgan = require('morgan');

const router = require('./router');
const app = express();


mongoose.connect('mongodb://localhost:auth/auth', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use(morgan('combined'));
app.use(bodyParser.json({ type: '*/*' }));
router(app);

const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log('Server listening on:', port);
