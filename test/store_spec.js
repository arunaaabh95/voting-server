immutable = require('immutable');
chai = require('chai');
makeStore = require('../src/store');

var Map = immutable.Map;
var fromJS = immutable.fromJS;
var expect = chai.expect;

describe('store', () => {

  it('is a Redux store configured with the correct reducer', () => {
    const store = makeStore.makeStore();
    expect(store.getState()).to.deep.equal(Map());

    store.dispatch({
      type: 'SET_ENTRIES',
      entries: ['Trainspotting', '28 Days Later']
    });

    expect(store.dispatch()).to.equal(fromJS({
      entries: ['Trainspotting', '28 Days Later'],
      initialEntries: ['Trainspotting', '28 Days Later']
    }));
  });

});
