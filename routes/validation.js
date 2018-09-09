var router = require('express').Router();
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var validator = require('../seat-validation/index');

app.use(bodyParser.json({type: 'application/json'})); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

router.post('/', function(req, res){
  validator.validate();
  res.send(req.body);
});

module.exports = app;
