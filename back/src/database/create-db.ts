import { Knex } from 'knex';
import db from './connection';

export const createDb = async () => {
  console.log('INITIALISATION OF DATABASE');

  // Table creation function
  const createTableIfNotExists = async (
    tableName: string,
    callback: (table: Knex.CreateTableBuilder) => void,
  ) => {
    const tableExists = await db.schema.hasTable(tableName);
    if (!tableExists) {
      await db.schema.createTable(tableName, callback);
    }
  };

  // Create account table
  await createTableIfNotExists('account', (table) => {
    table.increments('id').primary();
    table.string('username').unique();
    table.string('firstname');
    table.string('lastname');
    table.string('email').unique();
    table.string('password');
    table.string('token_validation');
    table.boolean('verified').defaultTo(false);
  });

  // Create profile table
  await createTableIfNotExists('profile', (table) => {
    table
      .integer('id')
      .primary()
      .references('id')
      .inTable('account')
      .onDelete('CASCADE');
    table.string('name').notNullable();
    table.string('bio');
    table.date('birth_date');
    table.enum('gender', ['male', 'female', 'other']).defaultTo('male');
    table.enum('completed_steps', [
      'name',
      'gender',
      'sexual_orientation',
      'photo',
      'bio',
      'tags',
      'completed',
    ]);
    table
      .enum('sexual_orientation', ['heterosexual', 'homosexual', 'bisexual'])
      .defaultTo('bisexual');
    table.boolean('online').defaultTo(false);
    table.timestamp('last_online').defaultTo(null);
  });

  // Create likes table
  await createTableIfNotExists('likes', (table) => {
    table.increments('id').primary();
    table
      .integer('liker_id')
      .references('id')
      .inTable('profile')
      .onDelete('CASCADE');
    table
      .integer('liked_id')
      .references('id')
      .inTable('profile')
      .onDelete('CASCADE');
    table.timestamp('created_at').defaultTo(db.fn.now());
  });

  // Create photo table
  await createTableIfNotExists('photo', (table) => {
    table.increments('id').primary();
    table
      .integer('user_id')
      .notNullable()
      .references('id')
      .inTable('profile')
      .onDelete('CASCADE');
    table.boolean('avatar').defaultTo(false);
    table.string('content_type');
    table.string('filename');
    table.string('path');
    table.bigInteger('size');
    table.timestamp('created_at').defaultTo(db.fn.now());
  });

  // Create conversation table
  await createTableIfNotExists('conversation', (table) => {
    table.increments('id').primary();
    table
      .integer('user_1')
      .notNullable()
      .references('id')
      .inTable('profile')
      .onDelete('CASCADE');
    table
      .integer('user_2')
      .notNullable()
      .references('id')
      .inTable('profile')
      .onDelete('CASCADE');
  });

  // Create message table
  await createTableIfNotExists('message', (table) => {
    table.increments('id').primary();
    table
      .integer('sender_id')
      .notNullable()
      .references('id')
      .inTable('profile')
      .onDelete('CASCADE');
    table
      .integer('conv_id')
      .notNullable()
      .references('id')
      .inTable('conversation')
      .onDelete('CASCADE');
    table.text('content');
    table.timestamp('created_at').defaultTo(db.fn.now());
  });

  // Create tags table
  await createTableIfNotExists('tags', (table) => {
    table.increments('id').primary();
    table.string('name');
  });

  // Create profile_tags table
  await createTableIfNotExists('profile_tags', (table) => {
    table.increments('id').primary();
    table
      .integer('profile_id')
      .references('id')
      .inTable('profile')
      .onDelete('CASCADE');
    table
      .integer('tag_id')
      .references('id')
      .inTable('tags')
      .onDelete('CASCADE');
    table.unique(['profile_id', 'tag_id']);
  });

  // Create notification table
  await createTableIfNotExists('notification', (table) => {
    table.increments('id').primary();
    table
      .integer('sender_id')
      .references('id')
      .inTable('profile')
      .onDelete('CASCADE');
    table
      .integer('receiver_id')
      .references('id')
      .inTable('profile')
      .onDelete('CASCADE');
    table.enum('type', ['message']);
    table.timestamp('created_at').defaultTo(db.fn.now());
  });
};
