import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import errorHandler from './utils/middleware/errorHandler';
import http from 'http';
import { env } from './config';
import SocketService from './socket.service';
import https from 'https';
import fs from 'fs';

class App {
  public app: express.Application;
  public port: number;
  private server: https.Server;
  private socketService: SocketService;

  constructor(controllers: any, port: number) {
    this.app = express();
    const key = fs.readFileSync('./key.pem');
    const cert = fs.readFileSync('./cert.pem');
    this.port = port;
    this.server = https.createServer({ key, cert }, this.app);
    this.app.use('/uploads', express.static('uploads'));
    this.app.use('/public', express.static('public'));

    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.socketService = new SocketService(this.server);
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
    this.socketService.listen();
  }

  public listen() {
    this.server.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }
}

export default App;
