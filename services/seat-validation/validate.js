const _ = require('lodash');
const SeatingService = require('../seating-service/seating-service');
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
  };

  //todo: add table validation - all row configurations should include check for paired tables
  //todo: making the assumption that selecting [O O PR PL PR O O] is valid

  performValidation(allAreaDetails) {
    return _.every(allAreaDetails, areaDetails => {
      return _.every(areaDetails, rowDetails => {
        return this.validateRow(rowDetails);
      });
    });
  }

  validateRow(seats) {
    let nextIndex = _.findIndex(seats, seat => seat.isPending);
    while (nextIndex >= 0) {
      let sectionStart = Math.max(0, nextIndex-2);
      let sectionEnd = Math.min(nextIndex+3, seats.length);
      let rowSection = _.slice(seats, sectionStart, sectionEnd);
      if (!this.validateUsingMethod(rowSection, seats[nextIndex])) {
        return false;
      }
      nextIndex = _.findIndex(seats, seat => seat.isPending, nextIndex+1);
    }
    return true;
  }

  validateUsingMethod(seats, seat) {
    if (!this.isAvailable(seat)) {
      return () => false;
    }

    if (seatingService.isAdaSeat(seat)) {
      return this.isValidAdaSeat(seats);
    } else if (seatingService.isPair(seat)) {
      return this.isValidSeatPair(seats);
    }
    return this.isValidNormalSeatRow(seats);
  }

  isAvailable(seat) {
    return !seatingService.isSold(seat)
      && seatingService.isEmptySeat(seat);
  }

  isValidAdaSeat() {
    return true;
  }

  isValidSeatPair(seats) {
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
    return !((!this.isOpen(seats[0]) &&  this.isOpen(seats[1])) // X O [?] _ _    <= invalid
      || (this.isOpen(seats[3]) && !this.isOpen(seats[4]))); // _ _ [?] O X    <= invalid

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
      return !(seats[1].isPending
        && seatingService.isEmptySeat(seats[0])
        && seatingService.isEmptySeat(seats[2])
      );
    }
    //Else, verify 4 seat section
    return this.isValidFourSeatRow(seats);
  }

  /**
   * Checks if an array of four seats are valid.
   *
   * There are so many permutations of things that could lead to a myriad of seating situations. For rows that are
   * this small (and presumably uncommon), let's only validate if the user has selected alternating seats.
   *
   * [?]  O  [?]  O   // <= INVALID
   *  O  [?]  O  [?] // <= INVALID
   *
   * @param seats
   */
  isValidFourSeatRow(seats) {
    let seat0Pending = seats[0].isPending;
    let seat1Pending = seats[1].isPending;
    let seat2Pending = seats[2].isPending;
    let seat3Pending = seats[3].isPending;

    return !(seat0Pending | seat1Pending
      && seat1Pending | seat2Pending
      && seat2Pending | seat3Pending);
  }

  isOpen(seat) {
    return seat.isPending == false && !seatingService.isSold(seat);
  }
}

module.exports = SeatValidation;