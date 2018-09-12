let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let SeatValidation = require('../services/seat-validation/validate');
let _ = require('lodash');

app.use(bodyParser.json({type: 'application/json'})); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.post('/:cinemaId/:sessionId', function(req, res) {
  //todo: THIS ENDPOINT NO WORK :\ It gets routed to that in index.js route
  console.log('got request');
  let seatValidation = new SeatValidation();
  seatValidation.validate(req.params.cinemaId, req.params.sessionId, req.body)
    .then(r => {
      res.send(r);
    })
    .catch(next);
});

module.exports = app;
