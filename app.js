require('dotenv').config();
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const { sendResponse, AppError } = require('./helpers/utils.js');
var indexRouter = require('./routes/index');

var app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
const mongoose = require('mongoose');

const allowlist = [
   'http://localhost:5500/',
   'http://localhost:3000',
   'https://main--enchanting-rugelach-5b1e9f.netlify.app',
];
app.use(cors({ origin: allowlist }));

mongoose
   .connect(process.env.MONGODB_URI)
   .then(() => console.log('Connect successful'))
   .catch((error) => {
      throw error;
   });

app.use('/', indexRouter);

app.use((req, res, next) => {
   const err = new AppError(404, 'Not Found', 'Bad Request');
   next(err);
});
const adjusts = app.use((err, req, res, next) => {
   console.log('ERROR', err);
   return sendResponse(
      res,
      err.statusCode ? err.statusCode : 500,
      false,
      null,
      { message: err.message },
      err.isOperational ? err.errorType : 'Internal Server Error',
   );
});

module.exports = app;
