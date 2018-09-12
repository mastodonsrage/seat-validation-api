let validationMocker = function() {
  this.mockArea1 = function() {

  };

  this.mockSelectedcolumns1 = function() {

  };

  this.mockEmptyAreasWithNumColumns = function(numColumns = 1) {
    let columns = [];

    for (let i = 0; i < numColumns; i++) {
      let column = this.mockDefaultEmptyNormalSeat(i);
      columns.push(column);
    }

    return {'0': {'0': columns}};
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

};

module.exports = validationMocker;