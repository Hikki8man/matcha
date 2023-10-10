import ProfileController from "./Profile/Profile.controller";
import UserAccountController from "./UserAccount/UserAccount.controller";
import App from "./app";
import db from "./database";
import dotenv from "dotenv";
// import {env} from "./config";
import AuthController from "./Auth/Auth.controller";

dotenv.config({path: "./env"});
// console.log(env);

db.connect()
  .then(() => {
    console.log("Connected to database");
    const app = new App(
      [
        new UserAccountController(),
        new ProfileController(),
        new AuthController(),
      ],
      8080
    );
    app.listen();
  })
  .catch((error) => {
    console.error("Failed to connect to database: ", error);
  });
