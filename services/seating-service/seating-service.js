const _ = require('lodash');
const SeatingProxy = require('../../remote-proxies/seating-proxy');

class SeatingService {

  /**
   * Gets row data for rows in the seats parameter.
   * @param cinemaId
   * @param sessionId
   * @param seats
   * @returns {Promise<T | void>}
   */
  getSeatingDataForSelected(cinemaId, sessionId, seats) {
    let seatingProxy = new SeatingProxy();

    return seatingProxy.getSeatingData(cinemaId, sessionId)
      .then(areas => this.filterForRelevantRows(areas, seats))
      .catch(error => {
        //todo: do more things here
        throw error;
      });
  }

  /**
   * Maps a list of seating objects to a nested object. For example:
   * {
   *   'areaIndex2': {
   *      'rowIndex3': ['columnIndex1', 'columnIndex2'],
   *      'rowIndex4': ['columnIndex7', 'columnIndex8']
   *    }
   * }
   * @param selected
   * @returns {*}
   */
  mapForSelectedSeats(selected) {
    return _.chain(selected)
      .groupBy(selectedArea => selectedArea.areaIndex)
      .mapValues(selectedArea => {
        return _.chain(selectedArea)
          .groupBy(selectedRow => selectedRow.rowIndex)
          .mapValues(selectedColumn => {
            return _.chain(selectedColumn)
              .map(row => row.columnIndex)
              .value();
          })
          .value();
      })
      .value();
  }

  hasValidSeatSelection(selectedSeats, sortedRowDetails) {
    return _.every(selectedSeats, (selectedSeat) => {
      return selectedSeat < sortedRowDetails.length && selectedSeat >= 0;
    });
  }

  mapSeats(unsortedRowDetails, selectedSeats) {
    //TODO: ASSUMPTION: the seat data endpoint will always return one seat object for each columnIndex in the row's range of columns
    let sortedRowDetails = _.sortBy(unsortedRowDetails.seats, seat => seat.columnIndex);
    if (!this.hasValidSeatSelection(selectedSeats, sortedRowDetails)) {
      //todo: handle this better. Ok workaround until I have time to implement
      throw 'Selected seat doesn\'t exist in row.';
    }

    _.forEach(selectedSeats, selectedSeat => {
      sortedRowDetails[selectedSeat]['isPending'] = true;
    });

    return sortedRowDetails;
  }


  /**
   * Returns true if seatStyle is either 'LEFT_PAIR' or 'RIGHT_PAIR'. Else, returns false.
   * @param seat
   * @returns {boolean}
   */
  isPair(seat) {
    return seat != null && (seat.seatStyle === 'LEFT_PAIR' || seat.seatStyle === 'RIGHT_PAIR');
  }

  /**
   * Returns true if seatStatus is 'EMPTY' or if seat is null. Else, returns false.
   * @param seat
   * @returns {boolean}
   */
  isEmptySeat(seat) {
    return seat != null && seat.seatStatus === 'EMPTY';
  }

  /**
   * Returns true if seat is null or if seat's seatStyle is 'NONE'. Else, returns false;
   * @param seat
   * @returns {boolean}
   */
  isNoneSeat(seat) {
    return seat != null && seat.seatStyle === 'NONE';
  }

  /**
   * Returns true if seat is not null and seatType is either 'HANDICAP', 'HANDICAP_SPACE', or 'COMPANION'.
   * @param seat
   * @returns {boolean}
   */
  isAdaSeat(seat) {
    return seat != null && _.includes(['HANDICAP', 'HANDICAP_SPACE', 'COMPANION'], seat.seatStyle);
  }

  isSold(seat) {
    return seat != null && seat.seatStatus === 'SOLD';
  }

  /**
   * Gets a map of relevant columns. Columns are grouped by areaId then rowId. Will also pull back column data for
   * two columns on each side of the selectedSeats, if present.
   * @param areas
   * @param selectedSeats
   * @returns {*}
   */
  filterForRelevantRows(areas, selectedSeats) {
    return this.combineAreas(areas, selectedSeats);
  }

  /**
   * Gets relevant seating data only for seats that were selected and each of the seats' surrounding chairs
   * @param areas
   * @param selectedAreas
   * @returns {*}
   */
  combineAreas(areas, selectedSeats) {
    return _.chain(areas)
      .filter(area => area.areaIndex in selectedSeats)
      .keyBy(area => area.areaIndex)
      .mapValues(area => this.extractRows(area, selectedSeats))
      .value();
  }

  extractRows(area, selectedSeats) {
    return _.chain(area.rows)
      .filter(row => row.rowIndex in selectedSeats[row.areaIndex])
      .keyBy(row => row.rowIndex)
      .mapValues(row => this.mapSeats(row, selectedSeats[row.areaIndex][row.rowIndex]))
      .value();
  }

}
module.exports = SeatingService;