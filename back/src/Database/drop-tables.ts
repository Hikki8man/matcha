import db from './connection';

export const dropTable = async () => {
  await db.schema.dropTableIfExists('likes');
  await db.schema.dropTableIfExists('photo');
  await db.schema.dropTableIfExists('message');
  await db.schema.dropTableIfExists('conversation');
  await db.schema.dropTableIfExists('profile_tags');
  await db.schema.dropTableIfExists('tags');
  await db.schema.dropTableIfExists('profile');
  await db.schema.dropTableIfExists('user_account');
};
