let router = require('express').Router();
let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let SeatValidation = require('../seat-validation/index');

app.use(bodyParser.json({type: 'application/json'})); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

router.post('/', function(req, res){
  let validator = new SeatValidation();
  validator.validate(req.body);
  res.send('We got you, fam.');
});

module.exports = router;
