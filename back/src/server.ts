import ProfileController from './user/profile/profile.controller';
import AccountController from './user/account/account.controller';
import App from './app';
import db from './database/connection';
import dotenv from 'dotenv';
import AuthController from './auth/auth.controller';
import ChatController from './chat/chat.controller';
import { createDb } from './database/create-db';
import { initDb } from './database/init-db';
import { dropTable } from './database/drop-tables';
import EditProfileController from './user/profile/edit/editProfile.controller';
import TagsController from './tags/tags.controller';
import CompleteProfileController from './user/profile/complete/completeProfile.controller';
import NotificationController from './notification/notification.controller';
import BlockController from './user/profile/block/block.controller';
import { AboutController } from './user/about/about.controller';

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
      const db_exist = await createDb();
      if (!db_exist) {
        await initDb();
      }
    } catch (err) {}
    const app = new App(
      [
        new AccountController(),
        new ProfileController(),
        new EditProfileController(),
        new CompleteProfileController(),
        new AuthController(),
        new ChatController(),
        new TagsController(),
        new NotificationController(),
        new BlockController(),
        new AboutController(),
      ],
      8080,
    );
    app.listen();
  } else {
    console.error('Unable to connect to the database');
  }
};

main();
