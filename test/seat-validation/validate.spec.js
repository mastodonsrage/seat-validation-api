process.env.NODE_ENV = 'test';
let chai = require('chai');
let assert = chai.assert;
let Validator = require('../../services/seat-validation/validate');
let validator = new Validator();
let Mocker = require('./test-utils/seat-validation-mocks');
let mocker = new Mocker();

/**
 * NOTE: column selections that need validation will be graphically displayed as ?
 */
describe('column Validation', () => {
  /**
   * Test column validation
   */
  describe('validate', () => {
    it('should return true when all selected columns have no single-column gaps (X ? ? X)', () => {
      let allAreaDetails = mocker.mockArea1();
      let selectedcolumns = mocker.mockSelectedcolumns1();

      assert.isOk(validator.performValidation(allAreaDetails, selectedcolumns));
      return ;
    });

    it('should return true when validating multiple areas and rows if all selections are valid', () => {
      /*
      Area1
         O  O [?] O O
        [?] O  O  O O
      Area2
        X [?] O
       */
    });

    it('should return true if there are two no columns to the left and right of the selected column', () => {
      // X X [?] X X
      let areas = mocker.mockEmptyAreasWithNumColumns(5);
      areas[0][0][0].seatStatus = 'SOLD';
      areas[0][0][1].seatStatus = 'SOLD';
      areas[0][0][2].isPending = true;
      areas[0][0][3].seatStatus = 'SOLD';
      areas[0][0][4].seatStatus = 'SOLD';
      assert.isOk(validator.performValidation(areas));
    });

    it('should return true if selection is surrounded by two empty columns', () => {
      // O O [?] O O
      let mockedAreas = mocker.mockEmptyAreasWithNumColumns(5);
      assert.isOk(validator.performValidation(mockedAreas));
    });

    it('should return true if there are no open columns to the left and two open columns to the right', () => {
      // X X [?] O O
      let mockedAreas = mocker.mockEmptyAreasWithNumColumns(5);
      mockedAreas[0][0][0].seatStatus = 'SOLD';
      mockedAreas[0][0][1].seatStatus = 'SOLD';
      mockedAreas[0][0][2].isPending = true;
      assert.isOk(validator.performValidation(mockedAreas));
    });

    it('should return true if there are two open columns to the left and no open columns to the right', () => {
      // O O [?] X X
      let mockedAreas = mocker.mockEmptyAreasWithNumColumns(5);
      mockedAreas[0][0][2].isPending = true;
      mockedAreas[0][0][3].seatStatus = 'SOLD';
      mockedAreas[0][0][4].seatStatus = 'SOLD';

      assert.isOk(validator.performValidation(mockedAreas));
    });

    it('should return false if any selected column leaves a single-column gap to the left', () => {
      // X O [?] O O
      let mockedAreas = mocker.mockEmptyAreasWithNumColumns(5);
      mockedAreas[0][0][0].seatStatus = 'SOLD';
      mockedAreas[0][0][2].isPending = true;

      assert.isNotOk(validator.performValidation(mockedAreas));

    });

    it('should return false if any selected column leaves a gap to the right', () => {
      // O O [?] O X
      let mockedAreas = mocker.mockEmptyAreasWithNumColumns(5);
      mockedAreas[0][0][2].isPending = true;
      mockedAreas[0][0][4].seatStatus = 'SOLD';

      assert.isNotOk(validator.performValidation(mockedAreas));
    });

    it('should return false if any column does not exist in the available columns', () => {
      //Case when: row has 5 columns but request contains columnIndex = 7
      //todo: implement this feature
    });

    //ADA validation
    it('should return true even when selecting *ADA* column leaves a single-column gap', () => {
      // X O [Q] O X
      let mockedAreas = mocker.mockEmptyAreasWithNumColumns(5);
      mockedAreas[0][0][0].seatStatus = 'SOLD';
      mockedAreas[0][0][2].isPending = true;
      mockedAreas[0][0][2].seatStyle = 'HANDICAP';
      mockedAreas[0][0][4].seatStatus = 'SOLD';
      assert.isOk(validator.performValidation(mockedAreas));
    });

    //Short row validation
    it('should return true if selected left-most column in row with two columns', () => {
      // [?] O
      let mockedAreas = mocker.mockEmptyAreasWithNumColumns(2);
      mockedAreas[0][0][0].isPending = true;
      assert.isOk(validator.performValidation(mockedAreas));
    });

    it('should return true if selected right-most column in row with two columns', () => {
      // O [?]
      let mockedAreas = mocker.mockEmptyAreasWithNumColumns(2);
      mockedAreas[0][0][1].isPending = true;
      assert.isOk(validator.performValidation(mockedAreas));
    });

    it('should return false if selected column is in middle of empty row with three columns', () => {
      // O [?] O
      let mockedAreas = mocker.mockEmptyAreasWithNumColumns(3);
      mockedAreas[0][0][1].isPending = true;
      assert.isNotOk(validator.performValidation(mockedAreas));
    });

    it('should return true if selected column is in middle of three column row and only column on left side is not empty', () => {
      // X [?] O
      let mockedAreas = mocker.mockEmptyAreasWithNumColumns(3);
      mockedAreas[0][0][0].seatStatus = 'SOLD';
      mockedAreas[0][0][1].isPending = true;
      assert.isOk(validator.performValidation(mockedAreas));
    });

    it('should return true if selected column is in middle of three column row and only column on right side is not empty', () => {
      // O [?] X
      let mockedAreas = mocker.mockEmptyAreasWithNumColumns(3);
      mockedAreas[0][0][1].isPending = true;
      mockedAreas[0][0][2].seatStatus = 'SOLD';
      assert.isOk(validator.performValidation(mockedAreas));
    });

    it('should retun true if attempting to select the far right seat if the far left seat is sold in a 3 column row', () => {
      // [?] O X
      let mockedAreas = mocker.mockEmptyAreasWithNumColumns(3);
      mockedAreas[0][0][0].isPending = true;
      mockedAreas[0][0][2].seatStatus = 'SOLD';
      assert.isOk(validator.performValidation(mockedAreas));
    });

    it('should return true if selected first column in four seat row and seat to the right is not empty', () => {
      // [?] X O O
      let mockedAreas = mocker.mockEmptyAreasWithNumColumns(4);
      mockedAreas[0][0][0].isPending = true;
      mockedAreas[0][0][1].seatStatus = 'SOLD';
      assert.isOk(validator.performValidation(mockedAreas));
    });

    it('should return true if selected first column in four seat row and the only other EMPTY seat in the row is to the right of the selected space', () => {
      // [?] O X X
      let mockedAreas = mocker.mockEmptyAreasWithNumColumns(4);
      mockedAreas[0][0][0].isPending = true;
      mockedAreas[0][0][2].seatStatus = 'SOLD';
      mockedAreas[0][0][3].seatStatus = 'SOLD';
      assert.isOk(validator.performValidation(mockedAreas));
    });

    it('should return true if selected second column in four seat row and there is one empty seat to the left', () => {
      // O [?] O X
      let mockedAreas = mocker.mockEmptyAreasWithNumColumns(4);
      mockedAreas[0][0][1].isPending = true;
      mockedAreas[0][0][3].seatStatus = 'SOLD';
      assert.isOk(validator.performValidation(mockedAreas));
    });

    it('should return false if the user selects alternating seats (O [?] O [?])', () => {
      // O [?] O [?]
      let mockedAreas = mocker.mockEmptyAreasWithNumColumns(4);
      mockedAreas[0][0][1].isPending = true;
      mockedAreas[0][0][3].isPending = true;
      assert.isNotOk(validator.performValidation(mockedAreas));
    });

    it('should return false if the user selects alternating seats ([?] O [?] O)', () => {
      // [?] O [?] O
      let mockedAreas = mocker.mockEmptyAreasWithNumColumns(4);
      mockedAreas[0][0][0].isPending = true;
      mockedAreas[0][0][2].isPending = true;
      assert.isNotOk(validator.performValidation(mockedAreas));
    });

    it('should return true if two selected seats are next to each other in empty row', () => {
      // O O [?] [?] O O
      let mockedAreas = mocker.mockEmptyAreasWithNumColumns(6);
      mockedAreas[0][0][2].isPending = true;
      mockedAreas[0][0][3].isPending = true;
      assert.isOk(validator.performValidation(mockedAreas));
    });

    it('should return false if two selected seats have one space in between them', () => {
      // O O [?] O [?] O O
      let mockedAreas = mocker.mockEmptyAreasWithNumColumns(7);
      mockedAreas[0][0][2].isPending = true;
      mockedAreas[0][0][4].isPending = true;
      assert.isNotOk(validator.performValidation(mockedAreas));
    });

    it('should return true if two selected seats have two spaces in between them', () => {
      // O O [?] O O [?] O O
      let mockedAreas = mocker.mockEmptyAreasWithNumColumns(8);
      mockedAreas[0][0][2].isPending = true;
      mockedAreas[0][0][5].isPending = true;
      assert.isOk(validator.performValidation(mockedAreas));
    });

    it('should return true if selected PAIR_LEFT and PAIR_RIGHT in row of empty columns', () => {
      // O PL PR O O
      //todo: implement logic
    });

    it('should return false if selected non-matching PAIR_RIGHT and PAIR_LEFT tables', () => {
      // O PR PL O O
      //todo: implement logic
    });

    it('should return true if selected SINGLE, PAIR_LEFT, PAIR_RIGHT tables', () => {
      // S PL PR
      //todo: implement logic
    });

    it('should return true if selected PAIR_RIGHT, PAIR_LEFT, PAIR_RIGHT tables', () => {
      // PR PL PR
      //todo: implement logic
    });

    it('should return true if selected PAIR_LEFT, PAIR_RIGHT, PAIR_RIGHT tables', () => {
      // PL PR PL
      //todo: implement logic
    });



























  });
});