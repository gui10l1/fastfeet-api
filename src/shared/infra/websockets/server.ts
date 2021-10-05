import socketio from 'socket.io';

import socketConfig from '@config/socketConfig';

export const socketServer = new socketio.Server(
  socketConfig.port,
  socketConfig.config,
);

socketServer.on('connection', socket => {
  console.log(socket.id);
});

export default socketServer;
