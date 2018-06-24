Store = require('./src/store');
Server = require('./src/server');
Entries = require('./entries.json');

const store = Store.makeStore();
Server.startServer(store);

store.dispatch({
  type: 'SET_ENTRIES',
  entries: Entries
});
store.dispatch({type: 'NEXT'});

module.exports = {
  store
}
