let createError = require('http-errors');
let express = require('express');
let path = require('path');
let logger = require('morgan');

let indexRouter = require('./routes/index');
let validationRouter = require('./routes/validation');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
let bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


app.use(express.static(__dirname + '/public'));
app.use('/validate', validationRouter);
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.send(404);
  return false;
});

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
});
app.use('/', require('./routes/validation'));
app.listen(8999, function() {
  console.log('Let\'s get ready to rumble!!!!');
});

module.exports = app;
