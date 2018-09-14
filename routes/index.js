let express = require('express');
let bodyParser = require('body-parser');
let router = express.Router();
let _ = require('lodash');

router.use(bodyParser.json()); // support json encoded bodies
router.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

router.get('/', function(req, res) {
  res.send('Yo, dawg.');
});

module.exports = router;

