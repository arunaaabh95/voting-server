immutable = require('immutable');

var list = immutable.List;
var map = immutable.Map;

const INITIAL_STATE = new map();

function setEntries(state, entries) {
  const List = list(entries);
  return state.set('entries', List)
              .set('initialEntries', List);
}

function getWinners(vote){
  if(!vote) {
    return [];
  }
  const[a, b] = vote.get('pair');
  const aVote = vote.getIn(['tally', a], 0);
  const bVote = vote.getIn(['tally', b], 0);
  if (aVote > bVote) {
    return [a];
  } else if (aVote < bVote) {
    return [b];
  } else {
    return [a, b];
  }
}

function next(state, round = state.get('vote', map()).get('round',0)) {
  const entries = state.get('entries').concat(getWinners(state.get('vote')))
  if (entries.size === 1) {
    return state.remove('vote')
                .remove('entries')
                .set('winner', entries.first());
  } else {
    return state.merge({
      vote: map({
        round: round + 1,
        pair: entries.take(2)
      }),
      entries: entries.skip(2)
    });
  }
}

function addVote(voteState, entry, voter) {
  if (voteState.get('pair').includes(entry)) {
    return voteState.updateIn(['tally', entry],0,t => t + 1)
                    .setIn(['votes', voter], entry);
  } else {
    return voteState;
  }
}

function removePreviousVote(voteState, voter) {
  const previousVote = voteState.getIn(['votes',voter], 0);
  console.log(previousVote);
  if (previousVote) {
    return voteState.updateIn(['tally', previousVote], t => t-1)
                    .removeIn(['votes', voter]);
  } else {
    return voteState;
  }
}

function vote(voteState, entry, voter) {
  return addVote(removePreviousVote(voteState,voter), entry, voter);
}

function restart(state) {
  const round = state.getIn(['vote', 'round'], 0);
  return next (
    state.set('entries', state.get('initialEntries'))
         .remove('vote')
         .remove('winner'),
         round
  );
}

module.exports = {
  setEntries,
  next,
  vote,
  restart,
  INITIAL_STATE
}

//Introducing Actions and Reducers
