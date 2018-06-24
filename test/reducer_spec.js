immutable = require('immutable');
chai = require('chai');
reducer = require('../src/reducer');

var expect = chai.expect;
var Map = immutable.Map;
var fromJS = immutable.fromJS;

describe('reducer', () => {

  it('handles SET_ENTRIES', () => {
    const initialState = Map();
    const action = {type: 'SET_ENTRIES', entries: ['Trainspotting']};
    const nextState = reducer.reduce(initialState, action);

    expect(nextState).to.equal(fromJS({
      entries: ['Trainspotting'],
      initialEntries: ['Trainspotting']
    }));
  });

  it('handles NEXT', () => {
    const initialState = fromJS({
      entries: ['Trainspotting', '28 Days Later']
    });
    const action = {type: 'NEXT'};
    const nextState = reducer.reduce(initialState, action);

    expect(nextState).to.equal(fromJS({
      vote:{
        round: 1,
        pair: ['Trainspotting', '28 Days Later']
      },
      entries: []
    }));
  });

  it('handles VOTE', () => {
    const initialState = fromJS({
      vote: {
        round: 1,
        pair: ['Trainspotting', '28 Days Later']
      },
      entries: []
    });
    const action = {type: 'VOTE', entry: 'Trainspotting', clientId: 'voter1'};
    const nextState = reducer.reduce(initialState, action);

    expect(nextState).to.equal(fromJS({
      vote: {
        round: 1,
        pair: ['Trainspotting', '28 Days Later'],
        tally: {Trainspotting: 1},
        votes: { voter1: 'Trainspotting'}
      },
      entries: []
    }));
  });

  it('can be used with reduce', () => {
    const actions = [
      {type: 'SET_ENTRIES', entries: ['Trainspotting', '28 Days Later']},
      {type: 'NEXT'},
      {type: 'VOTE', entry: 'Trainspotting', clientId: 'voter1'},
      {type: 'VOTE', entry: '28 Days Later', clientId: 'voter1'},
      {type: 'VOTE', entry: 'Trainspotting', clientId: 'voter1'},
      {type: 'NEXT'}
    ];
    const finalState = actions.reduce(reducer.reduce, Map());

    expect(finalState).to.equal(fromJS({
      initailEntries: ['Trainspotting', '28 Days Later'],
      winner: 'Trainspotting'
    }));
  });

});
