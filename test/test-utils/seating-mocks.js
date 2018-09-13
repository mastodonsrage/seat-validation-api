const _ = require('lodash');

let seatingMocker = function() {

  this.mockEmptySeatRowWithNumColumns = function(numColumns = 1) {
    let columns = this.mockEmptySeats(numColumns);
    return {'0': columns};
  };

  this.mockEmptySeats = function(numColumns = 1) {
    let columns = [];

    for (let i = 0; i < numColumns; i++) {
      let column = this.mockDefaultEmptyNormalSeat(i);
      columns.push(column);
    }

    return columns;
  };

  this.mockDefaultEmptyNormalSeat = function(columnIndex = 0) {
    let column = {};
    column['areaIndex'] = 0;
    column['rowIndex'] = 0;
    column['columnIndex'] = columnIndex;
    column['seatStatus'] = 'EMPTY';
    column['seatStyle'] = 'NORMAL';
    column['tableStyle'] = 'SINGLE';
    column['isPending'] = false;
    return column;
  };

  this.mockNoneSeatsRow = function(numColumns = 1, rowIndex = 0, areaIndex = 0) {
    let columns = [];

    for (let i = 0; i < numColumns; i++) {
      let column = this.mockDefaultNoneSeat(i, rowIndex, areaIndex);
      columns.push(column);
    }

    return columns;
  };

  this.mockDefaultNoneSeat = function(columnIndex = 0, rowIndex = 0, areaIndex = 0) {
    let column = {};
    column['areaIndex'] = areaIndex;
    column['rowIndex'] = rowIndex;
    column['columnIndex'] = columnIndex;
    column['seatStatus'] = 'EMPTY';
    column['seatStyle'] = 'NONE';
    column['tableStyle'] = 'SINGLE';
    column['isPending'] = false;
  };

};

module.exports = seatingMocker;