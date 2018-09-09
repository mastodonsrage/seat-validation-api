var _lodash = require('lodash/core');
var express = require('express');
var app = express();
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

var methods = {
  validate: function() {
    console.log('yessss');
    return;
  }
};

module.exports = methods;