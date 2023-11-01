import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import errorHandler from './Utils/errorHandler';
import http from 'http';
import { Server, Socket } from 'socket.io';
import authService from './Auth/Auth.service';
import db from './Database/database';
import { Conversation } from './Types/Chat';
import { env } from './config';

class App {
  public app: express.Application;
  public port: number;
  private server: http.Server;
  private static _io: Server;

  constructor(controllers: any, port: number) {
    this.app = express();
    this.port = port;
    this.server = http.createServer(this.app);
    App._io = new Server(this.server, {
      cors: { origin: env.FRONT_URL, credentials: true },
    });

    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeWebSocket();
    this.app.use(errorHandler);
  }

  private initializeMiddlewares() {
    this.app.use(express.json());
    this.app.use(
      cors({
        origin: env.FRONT_URL,
        credentials: true,
      }),
    );
    this.app.use(
      express.urlencoded({
        extended: true,
      }),
    );
    this.app.use(cookieParser());
  }

  private initializeControllers(controllers: [any]) {
    controllers.forEach((controller) => {
      this.app.use(controller.router);
    });
  }

  private initializeWebSocket() {
    console.log('initializeWebSocket');
    App._io.on('connection', (socket: Socket) => {
      // console.log('Socket connection', socket.handshake.headers.cookie);
      const tokenPairs = socket.handshake.headers.cookie!.split('; ');

      // Initialize the access_token variable
      let access_token = null;

      // Loop through the key-value pairs to find the access_token
      tokenPairs.forEach((pair) => {
        const [key, value] = pair.split('=');
        if (key === 'access_token') {
          access_token = value;
        }
      });
      if (access_token) {
        //else
        const payload = authService.verifyToken(access_token);
        if (!payload) {
          console.log('Token in socket expired');
          return socket.disconnect();
        }
        console.log('Socket authenticated by user ' + payload.id);
        socket.join(`user-${payload.id}`);
        db<Conversation>('conversation')
          .select('id')
          .where('user_1', payload.id)
          .orWhere('user_2', payload.id)
          .then((data) => {
            data.forEach((conv) => {
              console.log('join conversation ' + conv.id);
              socket.join(`conversation-${conv.id}`);
            });
          });
      }
      // console.log('user ' + socket.id + ' connected');
      // socket.send('hello');
      socket.on('message', function message(data) {
        console.log('received: %s', data);
      });
      socket.on('disconnect', () => {
        console.log('user ' + socket.id + ' disconnected');
      });
    });
  }

  public static get getIO(): Server {
    return App._io;
  }

  public listen() {
    this.server.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }
}

export default App;
