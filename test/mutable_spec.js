chai = require('chai');
immutable = require('immutable');

var expect = chai.expect;
var list = immutable.List;
var map = immutable.Map;

describe('immutability', () => {
  describe('a number', () => {

    function increment(currentState) {
      return currentState + 1;
    }

    it( 'is mutable', () =>{
      let state = 52;
      let nextState = increment(state);

      expect(nextState).to.equal(53);
      expect(state).to.equal(52);
    });
  });

  describe(' A List', ()=> {
    function addMovie(currentState, movie) {
      return currentState.push(movie);
    }

    it('is mutable list', () => {
      let state = list.of('Trainspotting', '28 days later');
      let nextState = addMovie(state, 'Sunshine');

      expect(nextState).to.equal(list.of(
        'Trainspotting',
        '28 days later',
        'Sunshine'
      ));

      expect(state).to.equal(list.of(
        'Trainspotting',
        '28 days later'
      ));

    });
  });
});
