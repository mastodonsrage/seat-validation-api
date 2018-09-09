var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var port = process.env.PORT || 3000;
var router = express.Router();
var validate = require('../seat-validation/index');

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

router.use(function(req, res, next){}); //defines middleware

app.post('/api/users/:name', function(req, res) {
  res.send(req.params.name);
});

// validation for path params
app.param('name', function(req, res, next, name) {

  // validate or whatever
  var modified = name + '-dude';

  // save name to the request
  req.params.name = modified;

  next();
});

app.post('/validate', function(req, res){
  validate.validate();
  res.end();
});


function createError(status, message) {
  var err = new Error(message);
  err.status = status;
  return err;
}

module.exports = app;
app.use('/', router);
app.listen(port, function() {
  console.log('Let\'s get ready to rumble!!!!');
});
///////////////////////////notes and stuffs
let seatingDataPath = 'https://drafthouse.com/s/mother/v1/app/seats/{cinemaId}/{sessionId}';
let areaIndex;
let rowIndex;
let columnIndex;
let seatStyle;
let seatStatus;
let tableStyle;
let warnings;


/* - RESPONSE OBJECT
{
  "isValid": true
}
(/

/**
 * GENERAL NOTES
 *
 * - handle getting seats coordinates that don't exist in theater
 * - handle data type issues
 * - handle showtime/theater/etc not existant
 * - unit tests and error logging, baby
 * - Use promises (ES6 or Bluebird - http://bluebirdjs.com) rather than direct callbacks in Node.
 * - Use lodash (https://lodash.com/) to make your collection manipulation (and other stuff) clean and functional.
 *
 * REQUIREMENTS
 * - Should handle the:
 * --  long table/single table seating logic (no single-seat gaps) that we mostly talked through
 * --  paired table logic (guests must sit at the same table if possible)
 * - relax the seating validation requirements if the theater is:
 * ---- below 20% occupancy on the day of the show
 * ---- below 50% occupancy within an hour of show time
 * ---- below 70% occupancy and within 30 minutes of show time.
 * -------- This will require coordination with an additional endpoint to get the show time for the session.
 * - One special case that I’d like you to tackle is the balcony seats at the Ritz (see email)
 *
 */

/*
RESOURCES:
- https://scotch.io/tutorials/learn-to-use-the-new-router-in-expressjs-4
- https://scotch.io/tutorials/use-expressjs-to-get-url-and-post-parameters
- https://expressjs.com/en/guide/migrating-5.html
- https://github.com/axios/axios
- https://medium.com/@zurfyx/building-a-scalable-node-js-express-app-1be1a7134cfd
- https://github.com/gothinkster/node-express-realworld-example-app/
- https://github.com/elsewhencode/project-guidelines#6-structure-and-naming
- https://github.com/airbnb/javascript - js style guide
- https://github.com/focusaurus/express_code_structure - express structure and stylings
- https://github.com/expressjs/express/tree/master/examples - expressjs examples (from express.js github repo)
 */
