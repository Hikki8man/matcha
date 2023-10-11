import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import errorHandler from "./Utils/errorHandler";
import http from "http";
import {Server} from "socket.io";

class App {
  public app: express.Application;
  public port: number;
  public io: Server;
  private server: http.Server;

  constructor(controllers: any, port: number) {
    this.app = express();
    this.port = port;
    this.server = http.createServer(this.app);
    this.io = new Server(this.server);

    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeWebSocket();
    this.app.use(errorHandler);
  }

  private initializeMiddlewares() {
    this.app.use(express.json());
    this.app.use(
      cors({
        origin: "http://localhost:3000",
        credentials: true,
      })
    );
    this.app.use(
      express.urlencoded({
        extended: true,
      })
    );
    this.app.use(cookieParser());
  }

  private initializeControllers(controllers: [any]) {
    controllers.forEach((controller) => {
      this.app.use(controller.router);
    });
  }

  private initializeWebSocket() {
    this.io.use;
    console.log("initializeWebSocket");
    this.io.on("connection", (socket) => {
      console.log("user " + socket.id + " connected");
      socket.send("hello");
      socket.on("message", function message(data) {
        console.log("received: %s", data);
      });
      socket.on("disconnect", () => {
        console.log("user " + socket.id + " disconnected");
      });
    });
  }

  public getIO(): Server {
    return this.io;
  }

  public listen() {
    this.server.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }
}

export default App;
