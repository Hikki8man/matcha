import db from "./database";

export const insertTestData = async () => {
  await db("user_account").insert([
    {email: "chaf@example.com", password: "hashed_password_for_chaf"},
    {email: "sawako@example.com", password: "hashed_password_for_sawako"},
    {email: "rico@example.com", password: "hashed_password_for_rico"},
    {email: "yurisa@example.com", password: "hashed_password_for_yurisa"},
  ]);

  // Insert into profile table
  await db("profile").insert([
    {user_id: 1, name: "Chaf", birth_date: "1998-09-15", gender: "male"},
    {user_id: 2, name: "Sawako", birth_date: "1993-08-20", gender: "female"},
    {user_id: 3, name: "Rico", birth_date: "1995-11-12", gender: "male"},
    {user_id: 4, name: "Yurisa", birth_date: "2001-04-03", gender: "female"},
  ]);

  // Insert into likes table
  await db("likes").insert([
    {liker_id: 1, liked_id: 2},
    {liker_id: 1, liked_id: 3},
    {liker_id: 3, liked_id: 4},
    {liker_id: 4, liked_id: 3},
  ]);
};
