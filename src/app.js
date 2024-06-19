const express = require('express');
const app = express();
require('dotenv').config();
var cors = require('cors');
const router = require('./routes/index');
const connect = require('./modules/Mongoose');
const { urlencoded } = require('body-parser');
const bodyParser = require('body-parser');
const morgan = require("morgan");
const helmet = require("helmet");
const passport = require('passport');
const cronJob = require('../src/modules/cronJob')

const { createServer } = require('node:http');
const server = createServer(app);

const port = process.env.PORT;

connect();
cronJob();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));
app.use(helmet());
app.use(bodyParser.json());
app.use(passport.initialize());
app.use('/', router);
server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
