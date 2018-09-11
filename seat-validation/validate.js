const _ = require('lodash');
const SeatingService = require('./seating-service');
const seatingService = new SeatingService();

/**
 * This class validates if a section of selected seats for any number of rows and areas is a valid selection.
 *
 * Assumptions:
 * - if a user selected a non-ADA seat within range of ADA seating, single-seat rules apply.
 *
 * A note on ASCII seat representations: some tests and functions are documented using an ASCII representation of the
 * seats under validation. We use the ASCII display codes used by the Mother ASCII Seating Art endpoint
 * (see https://drafthouse.com/s/mother/v1/app/seats/{cinemaId}/{sessionId}/render).
 * seatType representations are:
 * - NORMAL = "O"
 * - BARSEAT = "h"
 * - HOUSE = "H"
 * - HANDICAP = "Q"
 * - HANDICAP_SPACE = "q"
 * - COMPANION = "C"
 * - RECLINER = "L"
 * - UNKNOWN = "?"
 *
 * seatStatus representations are:
 * - Sold or otherwise unavailable = "X"
 * - Empty = "O"
 * - Seat being validated = "[?]"
 *
 * Table codes will only be included in representations when necessary. Relevant table codes are:
 * - PAIR_RIGHT = "PR"
 * - PAIR_LEFT = "PL"
 * - SINGLE = "SS"
 */

class SeatValidation {
  validate(cinemaId, sessionId, seats) {
    let selectedSeats = seatingService.mapForSelectedSeats(seats);
    return seatingService.getSeatingDataForSelected(cinemaId, sessionId, selectedSeats)
      .then(seatingAreaDetails => this.performValidation(seatingAreaDetails));
  }

  //todo: validate case when selected seat doesn't exist in area

  performValidation(allAreaDetails) {
    return _.every(allAreaDetails, areaDetails => {
      return _.every(areaDetails, rowDetails => {
        return this.validateRow(rowDetails);
      });
    });
  }

  validateRow(seats) {
    if (seats.length < 5
      && seats[0].seatStyle == 'NONE'
      && seats[seats.length-2].seatStyle == 'NONE') {
      return this.isValidShortRow(seats);
    }

    let firstPendingValidation = _.findIndex(seats, seat => seat.isPending);
    let lastPendingValidation = Math.min(_.findLastIndex(seats, seat => seat.isPending), seats.length-1);
    for (let i = firstPendingValidation; i < lastPendingValidation; i++) {
      let sectionStart = Math.abs(i-2);
      let sectionEnd = Math.min(i+3, seats.length-1);
      let rowSection = _.slice(seats, sectionStart, sectionEnd);
      let isValid = this.validateUsingMethod(rowSection);
      if (!isValid(rowSection)) {
        return false;
      }
    }
    return true;
  }

  validateUsingMethod(seat) {
    if (seatingService.isAdaSeat(seat)) {
      return this.isValidAdaSeat;
    } else if (seatingService.isSectionStart(seat)) {
      return this.isValidRowStart;
    } else if (seatingService.isPair(seat)) {
      return this.isValidSeatPair;
    } else if (seat.seatStyle == 'NONE') {
      return () => false;
    }
    return this.isValidNormalSeatRow;
  }

  isValidAdaSeat() {
    return true;
  }

  isValidSeatPair() {
    //if even number of seats are selected, verify that both LEFT and RIGHT are selected
    //if an odd number of seats are selected, do single-seat search
    //todo: implement me
    return true;
  }

  /*
  O O [?] O O   // OK
  _ X [?] O O   // OK
  O O [?] X _   // OK
  _ _ [?] O X   // NOT OK
  X O [?] _ _   // NOT OK
  */
  isValidNormalSeatRow(seats) {
    if (seats.length < 5) {
      return this.isValidShortRow(seats);
    }
    //todo: make this prettier
    return !(!seatingService.isEmptySeat(seats[0]) &&  seatingService.isEmptySeat(seats[1]) // X O [?] _ _    <= invalid
      || seatingService.isEmptySeat(seats[3]) && !seatingService.isEmptySeat(seats[4])); // _ _ [?] O X    <= invalid

  }

  /**
   * Single-seat validation for sections that have fewer than 5 seats.
   *
   * Sections that have two seats will all be considered valid.
   *
   * Sections that have three seats will be considered valid unless the selected seat is in the middle of an otherwise
   * empty row -- O [?] O //<= invalid
   *
   * Sections that have four seats
   *
   */
  isValidShortRow(seats) {
    if (seats.length <= 2) return true;
    if (seats.length == 3) {
      return seats[1].isPending
        && seatingService.isEmptySeat(seats[0])
        && seatingService.isEmptySeat(seats[1]);
    }
    //Else, verify 4 seat section
    return this.isValidFourSeatRow(seats);
  }

  /**
   * Checks if an array of four seats are valid.
   * O [?] X O // <= INVALID
   * O [?] O X // <= INVALID
   * O [?] O O // <= VALID - row still allows for another pair of people
   * O [?] X X // <= VALID - we want to allow groups of three people to sit here
   * @param seats
   */
  isValidFourSeatRow(seats) {
    if (!seats[1].isPending) {
      //Logic is reversed if seat undergoing validation is in index 2
      return this.isValidFourSeatRow(_.reverse(seats));
    }
    return seatingService.isEmptySeat(seats[0])
  }

  isValidRowStart(seats) {
    //todo: IMPLEMENT ME - hopefully we can bake this into some of the existing logic
    return true;
  }
}

module.exports = SeatValidation;