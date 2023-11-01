import ProfileController from './Profile/Profile.controller';
import UserAccountController from './UserAccount/UserAccount.controller';
import App from './app';
import db from './Database/connection';
import dotenv from 'dotenv';
import AuthController from './Auth/Auth.controller';
import ChatController from './Chat/Chat.controller';
import { createDb } from './Database/create-db';
import { initDb } from './Database/init-db';
import { dropTable } from './Database/drop-tables';
import EditProfileController from './Profile/EditProfile.controller';
import TagsController from './Tags/tags.controller';

dotenv.config({ path: './env' });

async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await db.raw('SELECT 1+1 as result');
    return true;
  } catch (error: any) {
    return false;
  }
}

const main = async () => {
  const connected = await checkDatabaseConnection();
  await dropTable();
  if (connected) {
    console.log('Connected to database');
    try {
      await createDb();
      await initDb();
    } catch (err) {
      console.error('Database init error: ', err);
    }
    const app = new App(
      [
        new UserAccountController(),
        new ProfileController(),
        new EditProfileController(),
        new AuthController(),
        new ChatController(),
        new TagsController(),
      ],
      8080,
    );
    app.listen();
  } else {
    console.error('Unable to connect to the database');
  }
};

main();
