import ProfileController from "./Profile/Profile.controller";
import UserAccountController from "./UserAccount/UserAccount.controller";
import App from "./app";
import db from "./database";
import dotenv from "dotenv";
import AuthController from "./Auth/Auth.controller";
import ChatController from "./Chat/Chat.controller";

dotenv.config({path: "./env"});
// console.log("tests");
db.connect()
  .then(() => {
    console.log("Connected to database");
    const app = new App(
      [
        new UserAccountController(),
        new ProfileController(),
        new AuthController(),
        new ChatController(),
      ],
      8080
    );
    app.listen();
  })
  .catch((error) => {
    console.error("Failed to connect to database: ", error);
  });
