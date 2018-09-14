process.env.NODE_ENV = 'test';
let chai = require('chai');
let assert = chai.assert;
let SeatingService = require('./../../services/seating-service/seating-service');
let service = new SeatingService();
let SeatingseatMocker = require('./../test-utils/seating-mocks');
let seatMocker = new SeatingseatMocker();

describe('mapForSelectedSeats', () => {
  it('should map to object nested by rows and seats, both in numerical order', function () {
    let unsortedRowDetails = seatMocker.mockEmptySeats(7);

    let selected = [
      {"areaIndex": 0, "rowIndex": 2, "columnIndex": 4},
      {"areaIndex": 0, "rowIndex": 2, "columnIndex": 6}
    ];

    //todo: finish implementing me
    // let result = service.mapSeats(unsortedRowDetails, selected);

    // assert.equal(result, { "2": [4, 6], "4": [2] });
  });
});

describe('hasValidSeatSelection', () => {
  it('should return true if all selected seats appear in row details', function () {
    //todo: implement me
  });

  it('should return false if selected seat is not in row', function () {
    //todo: implement me
  })
});

describe('get relevant seating', () => {
  it('should return false if selected column is not EMPTY', () => {
    /*
        0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21
        -----------------------------------------------------------------
    0 | _  O  O  O  O  O  O  O  O  O  O  O  O  O  O  O  O  O  O  O  O  _
    1 | _  O  O  O  O  O  O  O  O  O  O  X  X  O  O  O  O  O  X  X  X  _
    2 | _  O  O  O  O  O  O  X  X  X  X  X  X  X  O  O  O  O  O  O  X  _
    3 | _  Q  C  O  O  O  O  C  Q  _  _  Q  C  O  O  O  O  C  Q  _  Q  _
        ------------------------ BALCONY -------------------------------
    4 | PL~PR _ PL~PR  _  _  _  _  _  _  _  _  _  _  _  _ [PL~PR]_ PL~PR    //First and last pairs are SOLD
       */

    let balconySeatWarning104 = {
      'category': 107,
      'code': 104,
      'description': 'This seat is more expensive than a typical seat in this theater'
    };

    let balconySeatWarning105 = {
      'category': 107,
      'code': 105,
      'description': 'This seat is only sold as a pair with the seat next to it'
    };

    let balconyRow = seatMocker.mockNoneSeatsRow(22, 0, 1);
    // balconyRow[0][0].seatStatus = 'SOLD';
    // balconyRow[0][0].tableStyle = 'PAIR_LEFT';
    // balconyRow[0][0]['warnings'] = [balconySeatWarning104, balconySeatWarning105];
    // balconyRow[0][1].seatStatus = 'SOLD';
    // balconyRow[0][1].tableStyle = 'PAIR_RIGHT';
    // balconyRow[0][1]['warnings'] = [balconySeatWarning104, balconySeatWarning105];
    // balconyRow[0][3].seatStatus = 'EMPTY';
    // balconyRow[0][3].tableStyle = 'PAIR_LEFT';
    // balconyRow[0][3]['warnings'] = [balconySeatWarning104, balconySeatWarning105];
    // balconyRow[0][4].seatStatus = 'EMPTY';
    // balconyRow[0][4].tableStyle = 'PAIR_RIGHT';
    // balconyRow[0][4]['warnings'] = [balconySeatWarning104, balconySeatWarning105];
    //
    // balconyRow[0][17].seatStatus = 'EMPTY';
    // balconyRow[0][17].tableStyle = 'PAIR_LEFT';
    // balconyRow[0][17]['warnings'] = [balconySeatWarning104, balconySeatWarning105];
    // balconyRow[0][17].isPending = true;
    // balconyRow[0][18].seatStatus = 'EMPTY';
    // balconyRow[0][18].tableStyle = 'PAIR_RIGHT';
    // balconyRow[0][18]['warnings'] = [balconySeatWarning104, balconySeatWarning105];
    // balconyRow[0][18].isPending = true;
    // balconyRow[0][20].seatStatus = 'SOLD';
    // balconyRow[0][20].tableStyle = 'PAIR_LEFT';
    // balconyRow[0][20]['warnings'] = [balconySeatWarning104, balconySeatWarning105];
    // balconyRow[0][21].seatStatus = 'SOLD';
    // balconyRow[0][21].tableStyle = 'PAIR_RIGHT';
    // balconyRow[0][21]['warnings'] = [balconySeatWarning104, balconySeatWarning105];



    let area0 = {
      "0": seatMocker.mockEmptySeats(22),
      "1": seatMocker.mockEmptySeats(22),
      "2": seatMocker.mockEmptySeats(22),
      "3": seatMocker.mockEmptySeats(22)
    };
    let area1 = {
      "0": balconyRow
    };

    let allAreas = {
      "0": area0,
      "1": area1
    };

  });

  it('should return false if user selects two areas', () => {
    //todo:implment me
    // assert.isOk(false);
  });


});

describe('isAdaSeat', () => {

  it('should return true if seatStyle is HANDICAP', () => {
    let seat = {
      'seatStyle': 'HANDICAP'
    };

    assert.isOk(service.isAdaSeat(seat));
  });

  it('should return true if seatStyle is HANDICAP_SPACE', () => {
    let seat = {
      'seatStyle': 'HANDICAP_SPACE'
    };
    assert.isOk(service.isAdaSeat(seat));
  });

  it('should return true if seatStyle is COMPANION', () => {
    let seat = {
      'seatStyle': 'HANDICAP'
    };
    assert.isOk(service.isAdaSeat(seat));
  });
});

describe('arePairs', () => {
  it('should return true if first two seats are PAIR_LEFT and PAIR_RIGHT', function () {
    // PL PR
    let seat0 = seatMocker.mockEmptySeats(0);
    seat0.tableStyle = 'PAIR_LEFT';
    let seat1 = seatMocker.mockEmptySeats(1);
    seat1.tableStyle = 'PAIR_RIGHT';
    assert.isOk(service.arePairs([seat0, seat1]));
  });

  it('should return true if first table is NONE and second is PAIR_LEFT', function() {
    // _ PL PR
    let seat0 = seatMocker.mockEmptySeats(0);
    seat0.tableStyle = 'NONE';
    let seat1 = seatMocker.mockEmptySeats(1);
    seat1.tableStyle = 'PAIR_LEFT';
    let seat2 = seatMocker.mockEmptySeats(2);
    seat2.tableStyle = 'PAIR_RIGHT';
    let seats = [seat0, seat1, seat2];
    assert.isOk(service.arePairs(seats));
  });

  it('should return false if is empty row', function () {
    // _  _  _
    let seat0 = seatMocker.mockEmptySeats(0);
    seat0.tableStyle = 'NONE';
    let seat1 = seatMocker.mockEmptySeats(1);
    seat1.tableStyle = 'NONE';
    let seat2 = seatMocker.mockEmptySeats(2);
    seat2.tableStyle = 'NONE';
    let seats = [seat0, seat1, seat2];

    assert.isNotOk(service.arePairs(seats));
  });

  it('should return false if all tables are SINGLE', function () {
    // S S S
    let seat0 = seatMocker.mockEmptySeats(0);
    seat0.tableStyle = 'SINGLE';
    let seat1 = seatMocker.mockEmptySeats(1);
    seat1.tableStyle = 'SINGLE';
    let seat2 = seatMocker.mockEmptySeats(2);
    seat2.tableStyle = 'SINGLE';
    let seats = [seat0, seat1, seat2];

    assert.isNotOk(service.arePairs(seats));
  })
});

describe('isSoldAsPair', () => {

  it('should return true if seat has loveseat warning', () => {
    let seat = {
      'warnings': [
        {
          'category': 107,
          'code': 104,
          'description': 'This seat is more expensive than a typical seat in this theater'
        },{
          'category': 107,
          'code': 105,
          'description': 'This seat is only sold as a pair with the seat next to it'
        }
      ]
    };

    assert.isOk(service.isSoldAsPair(seat));
  });

  it('should return false if seat does not have loveseat warning()', () => {
    let seat = {
      'warnings': [
        {
          'category': 107,
          'code': 104,
          'description': 'This seat is more expensive than a typical seat in this theater'
        }
      ]
    };

    assert.isNotOk(service.isSoldAsPair(seat));
  });

});
