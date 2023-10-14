import ProfileController from "./Profile/Profile.controller";
import UserAccountController from "./UserAccount/UserAccount.controller";
import App from "./app";
import db from "./Database/database";
import dotenv from "dotenv";
import AuthController from "./Auth/Auth.controller";
import ChatController from "./Chat/Chat.controller";
import {initDb} from "./Database/init-db";
import {insertTestData} from "./Database/insert-data";
import {dropTable} from "./Database/drop-tables";

dotenv.config({path: "./env"});

async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await db.raw("SELECT 1+1 as result");
    return true;
  } catch (error: any) {
    return false;
  }
}

const main = async () => {
  const connected = await checkDatabaseConnection();
  // await dropTable();
  if (connected) {
    console.log("Connected to database");
    try {
      await initDb();
      await insertTestData();
    } catch (err) {
      // console.error("Database init error: ", err);
    }
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
  } else {
    console.error("Unable to connect to the database");
  }
};

main();
