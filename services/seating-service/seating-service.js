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
   *   'rowIndex3': ['columnIndex1', 'columnIndex2'],
   *   'rowIndex4': ['columnIndex7', 'columnIndex8']
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
    let sortedRowDetails = _.sortBy(unsortedRowDetails, seat => seat.columnIndex);
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
   * Returns true if row contains tableStyle that is either 'PAIR_LEFT' or 'PAIR_RIGHT'. Else, returns false.
   *
   * @param seat
   * @returns {boolean}
   */
  arePairs(seats) {
    let firstTableIndex = _.findIndex(seats, seat => seat.tableStyle !== 'NONE');

    //TODO: ASSUMPTION: that no single row will have multiple tableStyles (excluding NONE)
    //If it's a paired table, at least one of the first three tables must be PAIR_LEFT (one table could also be SINGLE)
    let tablePairPair = ['PAIR_LEFT', 'PAIR_RIGHT'];
    return firstTableIndex >= 0
      && (_.includes(tablePairPair, seats[firstTableIndex]['tableStyle'])
        || (seats[firstTableIndex].tableStyle === 'SINGLE' && seats[firstTableIndex+1].tableStyle === 'PAIR_LEFT'));
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

  isSoldAsPair(seat) {
    if (seat.warnings == null) {
      return false;
    }

    return _.some(seat.warnings, warning => warning['category'] === 107 && warning['code'] === 105);
  }

  /**
   * Gets a map of relevant columns. Columns are grouped by areaId then rowId. Will also pull back column data for
   * two columns on each side of the selectedSeats, if present.
   * @param areas
   * @param selectedSeats
   * @returns {*}
   */
  filterForRelevantRows(areas, selectedSeats) {
    return _.chain(areas)
      .filter(area => area.areaIndex in selectedSeats)
      .flatMap(area => this.extractRows(area, selectedSeats))
      .value();
  }

  extractRows(area, selectedSeats) {
    return _.chain(area.rows)
      .filter(row => row.rowIndex in selectedSeats[row.areaIndex])
      .map(row => this.mapSeats(row, selectedSeats[row.areaIndex][row.rowIndex]))
      .value();
  }

}
module.exports = SeatingService;