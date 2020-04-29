import * as http from 'http';
import * as dotenv from 'dotenv';
import { onError, onListening } from './http/config/handler';
import { Connection } from './db/Connection';
import { Server } from './server';
dotenv.config();

Connection.create().then(() => {
  const port = 3000;
  const s: Server = new Server();
  s.init();
  const server: http.Server = http.createServer(s.app);
  server.listen(port);

  server.on('error', (error: Error) => onError(error, port));
  server.on('listening', onListening.bind(server));
});
