let express = require('express');
let router = express.Router();
let bodyParser = require('body-parser');
let SeatValidation = require('../services/seat-validation/validate');
let _ = require('lodash');

router.use(bodyParser.json({type: 'application/json'})); // support json encoded bodies
router.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

/**
 * Validate request has value for areaIndex, rowIndex, and columnIndex
 */

let invalidListMessage = 'Request body must contain a list of objects with areaIndex, rowIndex, and columnIndex values';

/**
 * Validation for validation endpoint. All objects in request must
 * - have a request body
 * - request body contain a list of objects
 * - each object must have an areaIndex, rowIndex, and columnIndex
 * - must have numeric areaIndex, rowIndex, and columnIndex values
 * - can only have one areaIndex across all objects in list
 */

let validateBodyExists = function (req, res, next) {
  if (res.headersSent) {
    next();
  }
  //have a request body
  let body = req.body;
  if (body == null || !_.isArray(body)) {
    res.status(400).send({'errorMessage': invalidListMessage});
    return false;
  }

  next();
};

let validateBodyContainsArray = function(req, res, next) {
  if (res.headersSent) {
    next();
  }
  //request contains an array
  if(!_.isArray(req.body)) {
    res.status(400).send({'errorMessage': invalidListMessage});
    return false;
  }

  next();
};

let validateBodyContainsRequiredParams = function (req, res, next) {
  if (res.headersSent) {
    next();
  }
  //array must contain objects with required params
  let areaIndex;
  let requiredParameters = ['areaIndex', 'rowIndex', 'columnIndex'];
  _.forEach(req.body, object => {
    //Check has all required keys
    if (!_.isEqual(_.keysIn(object), requiredParameters)) {
      res.status(400).send({'errorMessage': invalidListMessage});
      return false;
    }

    //Check all values are numbers
    if (isNaN(object.areaIndex) || isNaN(object.rowIndex) || isNaN(object.columnIndex)) {
      res.status(400).send({'errorMessage': invalidListMessage});
      return false;
    }

    //Check is same areaIndex
    if (areaIndex == null) {
      areaIndex = object.areaIndex;
    }
    if (areaIndex !== object.areaIndex) {
      res.status(400).send({'errorMessage': 'Request can only contain seats from one area'});
      return false;
    }
  });

  next();
};

router.use(validateBodyExists, validateBodyContainsArray, validateBodyContainsRequiredParams);

router.post('/:cinemaId/:sessionId', function(req, res) {
  console.log('got request');
  let seatValidation = new SeatValidation();
  seatValidation.validate(req.params.cinemaId, req.params.sessionId, req.body)
    .then(r => {
      let responseBody = {'isValid': r };
      res.send(responseBody);
    })
    .catch(err => {
      throw err;
    });
});

module.exports = router;
