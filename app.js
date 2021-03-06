//Require all that's needed to power this App
//adding a few documentation
import express from 'express';
import bodyParser from 'body-parser';
import expressValidator from 'express-validator';
import path from 'path';
import morgan from 'morgan';
import './config/dbconnection';
let cors = require('cors');
import methodOverride from 'method-override';
import dotenv from 'dotenv';
import Seed from './seeders/Seed';

const rfs = require('rotating-file-stream');
const app = express();
app.use(cors());
// create a rotating write stream
const accessLogStream = rfs.createStream('access.log', {
  interval: '1d', // rotate daily
  path: path.join(__dirname, 'logs'),
});

//=========================================================
//All Middlewares here
//=========================================================
// Tell the bodyparser middleware to accept more data
app.use(bodyParser.json({ limit: '400mb' }));
app.use(bodyParser.urlencoded({ limit: '400mb', extended: true }));

app.use(morgan('combined', { stream: accessLogStream }));

//allowing for serving static files
app.use(express.static('public'));

app.use(expressValidator());
app.use(methodOverride());

process.env.TZ = 'Africa/Lagos';

//default landing:
app.get('/apidoc', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

//default landing:
app.get('/rave', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'rave.html'));
});

// Authentication Route
app.use('/v1/auth', require('./routes/v1/AuthRoute'));

// Article Route
app.use('/v1/article', require('./routes/v1/ArticleRoute'));

// Roles
app.use('/v1/role', require('./routes/v1/RoleRoute'));

// User
app.use('/v1/user', require('./routes/v1/UserRoute'));

// Comment
app.use('/v1/comment', require('./routes/v1/CommentRoute'));

//default landing:
app.all('*', (req, res) => {
  res.status(404).send({
    status: 'failed',
    status_code: 404,
    message: 'Resource not found',
  });
});

dotenv.config();

let seed = new Seed();
seed.seedRole();

//=========================================================
//Running the server on Port 3000 default
let PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`App is running on Port ${PORT}`);
});

module.exports = app;
