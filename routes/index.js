var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var port = process.env.PORT || 3000;
var router = express.Router();

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
  console.log(JSON.parse(req.body));
  res.send(JSON.parse(req.body));
  // res.send("recieved your request!");
});


function createError(status, message) {
  var err = new Error(message);
  err.status = status;
  return err;
}

module.exports = app;
app.use('/', router);
app.listen(port);
///////////////////////////notes and stuffs
var seatingDataPath = 'https://drafthouse.com/s/mother/v1/app/seats/{cinemaId}/{sessionId}';
var areaIndex;
var rowIndex;
var columnIndex;
var seatStyle;
var seatStatus;
var tableStyle;
var warnings;

var seats; //can have a seat style of NONE, meaning there isn’t a seat there.
const SeatStyleEnum = {
  NONE:"NONE", //no space
  NORMAL:"NORMAL",
  BARSEAT:"BARSEAT",
  HOUSE:"HOUSE", //empty - no space
  HANDICAP:"HANDICAP", //ADA
  HANDICAP_SPACE:"HANDICAP_SPACE", //ADA
  COMPANION:"COMPANION", //ADA
  RECLINER:"RECLINER",
  UNKNOWN:"UNKNOWN" //empty - no space
}

const SeatStatusEnum = {
  NONE:"NONE", //no space - will also have SeatStyleEnum.NONE
  EMPTY:"EMPTY", //Available to be sold
  SOLD:"SOLD", //not available
  RESERVED:"RESERVED", //not available
  BROKEN:"BROKEN", //not available
  PLACEHOLDER:"PLACEHOLDER", //not available
  UNKNOWN:"UNKNOWN" //not available
}


const TableStyleEnum = {
  NONE:"NONE", //??????????
  SINGLE:"SINGLE", //normal rules
  PAIR_LEFT:"PAIR_LEFT", //need pairing logic - row with paired tables and odd number of rows will have a SINGLE table at one end
  PAIR_RIGHT:"PAIR_RIGHT", //need pairing logic
  SIDE_TABLE_LEFT:"SIDE_TABLE_LEFT", //normal rules
  SIDE_TABLE_RIGHT:"SIDE_TABLE_RIGHT", //normal rules
  LONG_LEFT:"LONG_LEFT", //normal rules
  LONG_CENTER:"LONG_CENTER", //normal rules
  LONG_RIGHT:"LONG_RIGHT", //normal rules
  LONG_GAP:"LONG_GAP", //normal rules
  LONG_GAP_LEFT:"LONG_GAP_LEFT", //normal rules
  LONG_GAP_RIGHT:"LONG_GAP_RIGHT", //normal rules
  UNKNOWN:"UNKNOWN" //normal rules
}

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
 */

/*
RESOURCES:
- https://scotch.io/tutorials/learn-to-use-the-new-router-in-expressjs-4
- https://scotch.io/tutorials/use-expressjs-to-get-url-and-post-parameters
 */
