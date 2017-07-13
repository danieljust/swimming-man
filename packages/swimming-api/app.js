const express = require('express');
const app = express();
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const router = require('./routes/router');
const errorNotFound = require('./middlewares/ErrorNotFound');
const errorHandler = require('./middlewares/ErrorHandler');
const passport = require('./middlewares/Passport');
const favicon = require('serve-favicon');
const path = require('path');

app.use(favicon(path.join(__dirname,'public','images','favicon.png')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.use('/api',router);
app.use(errorNotFound);
app.use(errorHandler);

module.exports = app;
