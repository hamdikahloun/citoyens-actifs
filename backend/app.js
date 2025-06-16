require('dotenv').config();

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var communityRouter = require('./routes/community');
var postalCodeRouter = require('./routes/postalCode');
<<<<<<< HEAD
=======
var guestRouter = require('./routes/guest');
>>>>>>> c19ade598dcdb1e43a583671e0c5a384df35f589

var app = express();

const cors = require('cors');
app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/community', communityRouter);
app.use('/postalCode', postalCodeRouter);
<<<<<<< HEAD
=======
app.use('/guest', guestRouter);
>>>>>>> c19ade598dcdb1e43a583671e0c5a384df35f589

module.exports = app;