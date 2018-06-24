core = require('./core');

var setEntries = core.setEntries;
var next = core.next;
var vote = core.vote;
var restart = core.restart;

const INITIAL_STATE = core.INITIAL_STATE;

function reduce(state, action) {
  switch (action.type) {
    case 'SET_ENTRIES':
      return setEntries(state, action.entries);
      break;
    case 'NEXT':
      console.log(state.get('vote', 0));
      return next(state);
      break;
    case 'VOTE':
      return state.update('vote', voteState => vote(voteState, action.entry, action.clientId));
    case 'RESTART':
      return restart(state);
      break;
  }
  return state;
}

module.exports = {
  reduce
}
