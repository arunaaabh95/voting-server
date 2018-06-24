socket = require('socket.io');

function startServer(store) {
  const io = socket().attach(8090);
  store.subscribe(() => io.emit('state', store.getState()));
  io.on('connection', (socket) => {
    socket.emit('state', store.getState());
    socket.on('action', store.dispatch.bind(store));
  });
}

module.exports = {
  startServer
}
