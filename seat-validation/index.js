let _ = require('lodash/core');
let SeatingService = require('./seating-service');

class SeatValidation {
  validate(cinemaId, sessionId, seats) {
    console.log('SeatValidation.validate');
    let seatingService = new SeatingService();

    let selectedSeats = seatingService.mapSelectedSeats(seats);
    return seatingService.getSeatingDataForSelected(cinemaId, sessionId, selectedSeats)
      .then(seatingArea => performValidation(seatingArea, selectedSeats));
  }
};

function performValidation(seatingArea, selected) {
  return true;
}

module.exports = SeatValidation;