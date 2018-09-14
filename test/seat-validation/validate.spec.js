process.env.NODE_ENV = 'test';
let chai = require('chai');
let assert = chai.assert;
let Validator = require('../../services/seat-validation/validate');
let validator = new Validator();
let Mocker = require('../test-utils/seating-mocks');
let mocker = new Mocker();

/**
 * NOTE: column selections that need validation will be graphically displayed as ?
 */
describe('column Validation', () => {

  /**
   * Test validate
   */
  describe('validate', () => {
    it('Should do validation if able to map seats, get remote seating data, and all selections are valid', () => {
      //todo: implement me
    });

    it('Should return error if user selected seats that don\'t exist', () => {
      //todo: implement me
    });

    it('Should respond with error if call to get seating data fails', () => {
      //todo: implement me
    });
  });

  /**
   * Test column validation
   */
  describe('performValidation', () => {

    it('should return true when validating multiple rows if all selections are valid', () => {

      //todo: implement me
      // assert.isOk();

    });

    it('should return false if any row is invalid when validating multiple rows', () => {

      //todo: implement me
      // assert.isNotOk();
    });

    it('should return true for valid rows that have multiple NONE seats at the beginning of the row', () => {
      //todo: implement me
      //assert.isOk();
    });

    it('should return true if there are two no columns to the left and right of the selected column', () => {
      // X X [?] X X
      let rows = mocker.mockEmptySeatRowWithNumColumns(5);
      rows[0][0].seatStatus = 'SOLD';
      rows[0][1].seatStatus = 'SOLD';
      rows[0][2].isPending = true;
      rows[0][3].seatStatus = 'SOLD';
      rows[0][4].seatStatus = 'SOLD';
      assert.isOk(validator.performValidation(rows));
    });

    it('should return true if selection is surrounded by two empty columns', () => {
      // O O [?] O O
      let mockedRows = mocker.mockEmptySeatRowWithNumColumns(5);
      assert.isOk(validator.performValidation(mockedRows));
    });

    it('should return true if there are no open columns to the left and two open columns to the right', () => {
      // X X [?] O O
      let mockedRows = mocker.mockEmptySeatRowWithNumColumns(5);
      mockedRows[0][0].seatStatus = 'SOLD';
      mockedRows[0][1].seatStatus = 'SOLD';
      mockedRows[0][2].isPending = true;
      assert.isOk(validator.performValidation(mockedRows));
    });

    it('should return true if there are two open columns to the left and no open columns to the right', () => {
      // O O [?] X X
      let mockedRows = mocker.mockEmptySeatRowWithNumColumns(5);
      mockedRows[0][2].isPending = true;
      mockedRows[0][3].seatStatus = 'SOLD';
      mockedRows[0][4].seatStatus = 'SOLD';

      assert.isOk(validator.performValidation(mockedRows));
    });

    it('should return false if any selected column leaves a single-column gap to the left', () => {
      // X O [?] O O
      let mockedRows = mocker.mockEmptySeatRowWithNumColumns(5);
      mockedRows[0][0].seatStatus = 'SOLD';
      mockedRows[0][2].isPending = true;

      assert.isNotOk(validator.performValidation(mockedRows));

    });

    it('should return false if any selected column leaves a gap to the right', () => {
      // O O [?] O X
      let mockedRows = mocker.mockEmptySeatRowWithNumColumns(5);
      mockedRows[0][2].isPending = true;
      mockedRows[0][4].seatStatus = 'SOLD';

      assert.isNotOk(validator.performValidation(mockedRows));
    });

    it('should return true if single-space gap is caused by a seat with seatStyle == "NONE"', () => {
      // O N [?] O O
      let mockedRows = mocker.mockEmptySeatRowWithNumColumns(5);
      mockedRows[0][1].seatStyle = 'NONE';
      mockedRows[0][2].isPending = true;

      assert.isOk(validator.performValidation(mockedRows));
    });

    //ADA validation
    it('should return true even when selecting *ADA* column leaves a single-column gap', () => {
      // X O [Q] O X
      let mockedRows = mocker.mockEmptySeatRowWithNumColumns(5);
      mockedRows[0][0].seatStatus = 'SOLD';
      mockedRows[0][2].isPending = true;
      mockedRows[0][2].seatStyle = 'HANDICAP';
      mockedRows[0][4].seatStatus = 'SOLD';
      assert.isOk(validator.performValidation(mockedRows));
    });

    //Short row validation
    it('should return true if selected left-most column in row with two columns', () => {
      // [?] O
      let mockedRows = mocker.mockEmptySeatRowWithNumColumns(2);
      mockedRows[0][0].isPending = true;
      assert.isOk(validator.performValidation(mockedRows));
    });

    it('should return true if selected right-most column in row with two columns', () => {
      // O [?]
      let mockedRows = mocker.mockEmptySeatRowWithNumColumns(2);
      mockedRows[0][1].isPending = true;
      assert.isOk(validator.performValidation(mockedRows));
    });

    it('should return false if selected column is in middle of empty row with three columns', () => {
      // O [?] O
      let mockedRows = mocker.mockEmptySeatRowWithNumColumns(3);
      mockedRows[0][1].isPending = true;
      assert.isNotOk(validator.performValidation(mockedRows));
    });

    it('should return true if selected column is in middle of three column row and only column on left side is not empty', () => {
      // X [?] O
      let mockedRows = mocker.mockEmptySeatRowWithNumColumns(3);
      mockedRows[0][0].seatStatus = 'SOLD';
      mockedRows[0][1].isPending = true;
      assert.isOk(validator.performValidation(mockedRows));
    });

    it('should return true if selected column is in middle of three column row and only column on right side is not empty', () => {
      // O [?] X
      let mockedRows = mocker.mockEmptySeatRowWithNumColumns(3);
      mockedRows[0][1].isPending = true;
      mockedRows[0][2].seatStatus = 'SOLD';
      assert.isOk(validator.performValidation(mockedRows));
    });

    it('should retun true if attempting to select the far right seat if the far left seat is sold in a 3 column row', () => {
      // [?] O X
      let mockedRows = mocker.mockEmptySeatRowWithNumColumns(3);
      mockedRows[0][0].isPending = true;
      mockedRows[0][2].seatStatus = 'SOLD';
      assert.isOk(validator.performValidation(mockedRows));
    });

    it('should return true if selected first column in four seat row and seat to the right is not empty', () => {
      // [?] X O O
      let mockedRows = mocker.mockEmptySeatRowWithNumColumns(4);
      mockedRows[0][0].isPending = true;
      mockedRows[0][1].seatStatus = 'SOLD';
      assert.isOk(validator.performValidation(mockedRows));
    });

    it('should return true if selected first column in four seat row and the only other EMPTY seat in the row is to the right of the selected space', () => {
      // [?] O X X
      let mockedRows = mocker.mockEmptySeatRowWithNumColumns(4);
      mockedRows[0][0].isPending = true;
      mockedRows[0][2].seatStatus = 'SOLD';
      mockedRows[0][3].seatStatus = 'SOLD';
      assert.isOk(validator.performValidation(mockedRows));
    });

    it('should return true if selected second column in four seat row and there is one empty seat to the left', () => {
      // O [?] O X
      let mockedRows = mocker.mockEmptySeatRowWithNumColumns(4);
      mockedRows[0][1].isPending = true;
      mockedRows[0][3].seatStatus = 'SOLD';
      assert.isOk(validator.performValidation(mockedRows));
    });

    it('should return false if the user selects alternating seats (O [?] O [?])', () => {
      // O [?] O [?]
      let mockedRows = mocker.mockEmptySeatRowWithNumColumns(4);
      mockedRows[0][1].isPending = true;
      mockedRows[0][3].isPending = true;
      assert.isNotOk(validator.performValidation(mockedRows));
    });

    it('should return false if the user selects alternating seats ([?] O [?] O)', () => {
      // [?] O [?] O
      let mockedRows = mocker.mockEmptySeatRowWithNumColumns(4);
      mockedRows[0][0].isPending = true;
      mockedRows[0][2].isPending = true;
      assert.isNotOk(validator.performValidation(mockedRows));
    });

    it('should return true if two selected seats are next to each other in empty row', () => {
      // O O [?] [?] O O
      let mockedRows = mocker.mockEmptySeatRowWithNumColumns(6);
      mockedRows[0][2].isPending = true;
      mockedRows[0][3].isPending = true;
      assert.isOk(validator.performValidation(mockedRows));
    });

    it('should return false if two selected seats have one space in between them', () => {
      // O O [?] O [?] O O
      let mockedRows = mocker.mockEmptySeatRowWithNumColumns(7);
      mockedRows[0][2].isPending = true;
      mockedRows[0][4].isPending = true;
      assert.isNotOk(validator.performValidation(mockedRows));
    });

    it('should return true if two selected seats have two spaces in between them', () => {
      // O O [?] O O [?] O O
      let mockedRows = mocker.mockEmptySeatRowWithNumColumns(8);
      mockedRows[0][2].isPending = true;
      mockedRows[0][5].isPending = true;
      assert.isOk(validator.performValidation(mockedRows));
    });

    it('should return true if selected PAIR_LEFT and PAIR_RIGHT in row of empty columns', () => {
      // PL PR [PL] [PR] PL PR
      let mockedRows = mocker.mockEmptySeatRowWithNumColumns(6);
      mockedRows[0][0].tableStyle = 'PAIR_LEFT';
      mockedRows[0][1].tableStyle = 'PAIR_RIGHT';
      mockedRows[0][2].tableStyle = 'PAIR_LEFT';
      mockedRows[0][2].isPending = true;
      mockedRows[0][3].tableStyle = 'PAIR_RIGHT';
      mockedRows[0][3].isPending = true;
      mockedRows[0][4].tableStyle = 'PAIR_LEFT';
      mockedRows[0][5].tableStyle = 'PAIR_RIGHT';

      assert.isOk(validator.performValidation(mockedRows));
    });

    it('should return false if selected non-matching PAIR_RIGHT and PAIR_LEFT tables', () => {
      // PL [PR] [PL] PR S
      let mockedRows = mocker.mockEmptySeatRowWithNumColumns(6);
      mockedRows[0][0].tableStyle = 'PAIR_LEFT';
      mockedRows[0][1].tableStyle = 'PAIR_RIGHT';
      mockedRows[0][1].isPending = true;
      mockedRows[0][2].tableStyle = 'PAIR_LEFT';
      mockedRows[0][2].isPending = true;
      mockedRows[0][3].tableStyle = 'PAIR_RIGHT';
      mockedRows[0][4].tableStyle = 'SINGLE';
      assert.isNotOk(validator.performValidation(mockedRows));
    });

    it('should return true if selected SINGLE, PAIR_LEFT, PAIR_RIGHT tables', () => {
      // [S] [PL] [PR] PL PR
      let mockedRows = mocker.mockEmptySeatRowWithNumColumns(5);
      mockedRows[0][0].tableStyle = 'SINGLE';
      mockedRows[0][0].isPending = true;
      mockedRows[0][1].tableStyle = 'PAIR_LEFT';
      mockedRows[0][1].isPending = true;
      mockedRows[0][2].tableStyle = 'PAIR_RIGHT';
      mockedRows[0][2].isPending = true;
      mockedRows[0][3].tableStyle = 'PAIR_LEFT';
      mockedRows[0][4].tableStyle = 'PAIR_RIGHT';

      assert.isOk(validator.performValidation(mockedRows));
    });

    it('should return true if PAIR_LEFT and PAIR_RIGHT are selected, but has SINGLE open to the left', () => {
      // S [PL] [PR] PL PR
      let mockedRows = mocker.mockEmptySeatRowWithNumColumns(5);
      mockedRows[0][0].tableStyle = 'SINGLE';
      mockedRows[0][1].tableStyle = 'PAIR_LEFT';
      mockedRows[0][1].isPending = true;
      mockedRows[0][2].tableStyle = 'PAIR_RIGHT';
      mockedRows[0][2].isPending = true;
      mockedRows[0][3].tableStyle = 'PAIR_LEFT';
      mockedRows[0][4].tableStyle = 'PAIR_RIGHT';

      assert.isOk(validator.performValidation(mockedRows));
    });

    it('should return true if PAIR_LEFT and PAIR_RIGHT are selected, but has SINGLE open to the right', () => {
      // PL PR [PL] [PR] S
      let mockedRows = mocker.mockEmptySeatRowWithNumColumns(5);
      mockedRows[0][0].tableStyle = 'PAIR_LEFT';
      mockedRows[0][1].tableStyle = 'PAIR_RIGHT';
      mockedRows[0][2].tableStyle = 'PAIR_LEFT';
      mockedRows[0][2].isPending = true;
      mockedRows[0][3].tableStyle = 'PAIR_RIGHT';
      mockedRows[0][3].isPending = true;
      mockedRows[0][4].tableStyle = 'SINGLE';

      assert.isOk(validator.performValidation(mockedRows));
    });

    it('should return true if selected PAIR_RIGHT, PAIR_LEFT, PAIR_RIGHT tables', () => {
      // PR PL [PR] [PL] [PR] PL PR
      let mockedRows = mocker.mockEmptySeatRowWithNumColumns(7);
      mockedRows[0][0].tableStyle = 'PAIR_RIGHT';
      mockedRows[0][1].tableStyle = 'PAIR_LEFT';
      mockedRows[0][2].tableStyle = 'PAIR_RIGHT';
      mockedRows[0][2].isPending = true;
      mockedRows[0][3].tableStyle = 'PAIR_LEFT';
      mockedRows[0][3].isPending = true;
      mockedRows[0][4].tableStyle = 'PAIR_RIGHT';
      mockedRows[0][5].tableStyle = 'PAIR_LEFT';
      mockedRows[0][6].tableStyle = 'PAIR_RIGHT';
      assert.isOk(validator.performValidation(mockedRows));
    });

    it('should return true if selected PAIR_LEFT, PAIR_RIGHT, PAIR_RIGHT tables', () => {
      // PL PR [PL] [PR] [PL] PR PL
      let mockedRows = mocker.mockEmptySeatRowWithNumColumns(7);
      mockedRows[0][0].tableStyle = 'PAIR_LEFT';
      mockedRows[0][1].tableStyle = 'PAIR_RIGHT';
      mockedRows[0][2].tableStyle = 'PAIR_LEFT';
      mockedRows[0][2].isPending = true;
      mockedRows[0][3].tableStyle = 'PAIR_RIGHT';
      mockedRows[0][3].isPending = true;
      mockedRows[0][4].tableStyle = 'PAIR_LEFT';
      mockedRows[0][5].tableStyle = 'PAIR_RIGHT';
      mockedRows[0][6].tableStyle = 'PAIR_LEFT';
      assert.isOk(validator.performValidation(mockedRows));
    });

    it('should return true if user selects both PAIR_LEFT and PAIR_RIGHT loveseats', () => {
      //todo: implement me
      // assert.isOk();
    });

    it('should return false if user selects only PAIR_LEFT for love seat', () => {
      //todo: implemnt me
      // assert.isNotOk();
    });
  });
});