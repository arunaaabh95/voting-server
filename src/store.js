redux = require('redux');
reducer = require('./reducer');
core = require('./core');

function makeStore() {
  return redux.createStore(reducer.reduce, core.INITIAL_STATE);
}

module.exports = {
  makeStore
}
