import db from "./database";

export const initDb = async () => {
  console.log("INITIALISATION OF DATABASE");

  // Table creation function
  const createTableIfNotExists = async (
    tableName: string,
    callback: (table: any) => void
  ) => {
    const tableExists = await db.schema.hasTable(tableName);
    if (!tableExists) {
      await db.schema.createTable(tableName, callback);
    }
  };

  // Create user_account table
  await createTableIfNotExists("user_account", (table) => {
    table.increments("id").primary();
    table.string("email").unique();
    table.string("password");
    table.string("token_validation");
    table.boolean("verified").defaultTo(false);
  });

  // Create profile table
  await createTableIfNotExists("profile", (table) => {
    table
      .integer("user_id")
      .primary()
      .references("id")
      .inTable("user_account")
      .onDelete("CASCADE");
    table.string("name").notNullable();
    table.date("birth_date");
    table.enum("gender", ["male", "female"]).notNullable();
    table.enum("completed_steps", [
      "name",
      "gender",
      "photo",
      "bio",
      "completed",
    ]);
  });

  // Create likes table
  await createTableIfNotExists("likes", (table) => {
    table.increments("id").primary();
    table
      .integer("liker_id")
      .references("id")
      .inTable("user_account")
      .onDelete("CASCADE");
    table
      .integer("liked_id")
      .references("id")
      .inTable("user_account")
      .onDelete("CASCADE");
    table.timestamp("created_at").defaultTo(db.fn.now());
  });

  // Create photo table
  await createTableIfNotExists("photo", (table) => {
    table.increments("id").primary();
    table
      .integer("user_id")
      .notNullable()
      .references("id")
      .inTable("user_account")
      .onDelete("CASCADE");
    table.string("filename");
    table.string("path");
    table.bigInteger("size");
    table.timestamp("created_at").defaultTo(db.fn.now());
  });

  // Create conversation table
  await createTableIfNotExists("conversation", (table) => {
    table.increments("id").primary();
    table
      .integer("user_1")
      .notNullable()
      .references("user_id")
      .inTable("profile")
      .onDelete("CASCADE");
    table
      .integer("user_2")
      .notNullable()
      .references("user_id")
      .inTable("profile")
      .onDelete("CASCADE");
  });

  // Create message table
  await createTableIfNotExists("message", (table) => {
    table.increments("id").primary();
    table
      .integer("sender_id")
      .notNullable()
      .references("user_id")
      .inTable("profile")
      .onDelete("CASCADE");
    table
      .integer("conv_id")
      .notNullable()
      .references("id")
      .inTable("conversation")
      .onDelete("CASCADE");
    table.text("content");
    table.timestamp("created_at").defaultTo(db.fn.now());
  });
};
