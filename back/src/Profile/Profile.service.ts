import db from "../database";

class ProfileService {
  async get_by_id(id: number) {
    try {
      // return await db.manyOrNone(
      //   `SELECT profile.* FROM profile RIGHT JOIN photo ON profile.user_id = photo.user_id WHERE profile.user_id = $1`,
      //   id
      // );
      return await db.oneOrNone(
        `SELECT profile.*, json_agg(photo.*) AS photos FROM profile LEFT JOIN photo ON profile.user_id = photo.user_id WHERE profile.user_id = $1 GROUP BY profile.user_id`,
        id
      );
    } catch (e: any) {
      console.log("Error", e.message);
      return undefined;
    }
  }

  async get_all(id: number) {
    try {
      return await db.manyOrNone(
        `SELECT * FROM profile WHERE user_id != $1`,
        id
      );
    } catch (e: any) {
      console.log("error in getting all profile", e.message);
      return undefined;
    }
  }
}

export default new ProfileService();
