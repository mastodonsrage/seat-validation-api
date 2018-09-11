process.env.NODE_ENV = 'test';

let Validator = require('../seat-validation/validate');
let validator = new Validator();

/**
 * NOTE: seat selections that need validation will be graphically displayed as ?
 */
describe('Seat Validation', () => {
  /**
   * Test seat validation
   */
  describe('validate', () => {
    it('should return true when all selected seats have no single-seat gaps (X ? ? X)', (done) => {
      let allAreaDetails = mockArea1();
      let selectedSeats = mockSelectedSeats1();

      assert.isOk(validator.performValidation(allAreaDetails, selectedSeats));

    });

    it('should return true if there are no open seats to the left and right of the selected seat', (done) => {
      // _ X [?] X _
    });

    it('should return true even when selecting ADA seat leaves a single-seat gap', (done) => {
      // X O [Q] _ _
    });

    it('should return true if there are two open seats to the left and right of the selected seat', (done) => {
      // X X [?] X X
    });

    it('should return true if there are no open seats to the left and two open seats to the right', (done) => {
      // X X [?] O O
    });

    it('should return true if there are two open seats to the left and no open seats to the right', (done) => {
      // O O [?] X X
    });

    it('should return false if any selected seat leaves a single-seat gap to the left', (done) => {
      // X O [?] O O
    });

    it('should return false if any selected seat gap to the right', (done) => {
      // O O [?] O X
    });

    it('should return false if any selected seat does not exist in the available seats', (done) => {

    });

    it('should return false if any selected seat is not EMPTY', (done) => {

    });
  });
});