const _ = require('lodash');
const SeatingProxy = require('../remote-proxies/seating-proxy');

class SeatingService {

  getSeatingDataForSelected(cinemaId, sessionId, seats) {
    let seatingProxy = new SeatingProxy();

    return seatingProxy.getSeatingData(cinemaId, sessionId)
      .then(areas => retrieveRelevantRows(areas, seats))
      .catch(error => console.log(error));
  }

  mapSelectedSeats(selected) {
    return _.chain(selected)
      .groupBy(selectedArea => {
        return selectedArea.areaIndex;
      })
      .mapValues(selectedArea => {
        return _.chain(selectedArea)
          .groupBy(selectedRow => {
            return selectedRow.rowIndex;
          })
          .mapValues(selectedColumn => {
            return _.chain(selectedColumn)
              .map(row => row.columnIndex)
              .value();
          })
          .value();
      })
      .value();
  }

}

/**
 * Gets relevant seating data only for seats that were selected and each of the seats' surrounding chairs
 * @param areas
 * @param selectedSeats
 * @returns {*}
 */
function combineAreas(areas, selectedSeats) {
  return _.chain(areas)
    .filter(area => area.areaIndex in selectedSeats)
    .keyBy(area => area.areaIndex)
    .mapValues(area => extractRows(area, selectedSeats))
    .value();
}

function extractRows(area, selectedSeats) {
  return _.chain(area.rows)
    .filter(row => row.rowIndex in selectedSeats[row.areaIndex])
    .keyBy(row => row.rowIndex)
    .mapValues(row => row.seats)
    .value();
}

function retrieveRelevantRows(areas) {
  return combineAreas(areas, selectedSeats);
}

module.exports = SeatingService;