let express = require('express');
let bodyParser = require('body-parser');
let app = express();
let router = express.Router();
let SeatValidation = require('../seat-validation/validate');

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.post('/validate/:cinemaId/:sessionId', function(req, res) {
  console.log('got request');
  let seatValidation = new SeatValidation();
  seatValidation.validate(req.params.cinemaId, req.params.sessionId, req.body)
    .then(r => {
      let responseBody = {'isValid': r};
      res.send(responseBody);
    })
    .catch((res) => res.status(500).send('Uh oh. Something bad happened...'));
});

app.post('/', function(req, res) {
  res.send('Yo, dawg.');
});

module.exports = app;

app.use('/', router);
app.listen(8999, function() {
  console.log('Let\'s get ready to rumble!!!!');
});
