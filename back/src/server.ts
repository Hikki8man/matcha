import ProfileController from "./Profile/Profile.controller";
import UserAccountController from "./UserAccount/UserAccount.controller";
import App from "./app";
import db from "./database";
import dotenv from "dotenv";
import AuthController from "./Auth/Auth.controller";
import ChatController from "./Chat/Chat.controller";

dotenv.config({path: "./env"});

async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await db.raw("SELECT 1+1 as result");
    return true;
  } catch (error: any) {
    return false;
  }
}

// checkDatabaseConnection().then((connected: boolean) => {
//   if (connected) {
//     console.log("Database connection successful.");
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
// } else {
//   console.error("Unable to connect to the database");
// }
// });
