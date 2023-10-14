import {Profile} from "../Types/Profile";
import db from "../database";

class ProfileService {
  async get_by_id(id: number) {
    try {
      return await db<Profile>("profile")
        .select("*")
        .where("user_id", id)
        .first();
      // return await db.oneOrNone(
      //   `SELECT profile.*, json_agg(photo.*) AS photos FROM profile LEFT JOIN photo ON profile.user_id = photo.user_id WHERE profile.user_id = $1 GROUP BY profile.user_id`,
      //   id
      // );
    } catch (e: any) {
      console.log("Error", e.message);
      return undefined;
    }
  }

  async get_all(id: number) {
    try {
      return await db<Profile>("profile").select("*").whereNot("user_id", id);
    } catch (e: any) {
      console.log("error in getting all profile", e.message);
      return undefined;
    }
  }
}

export default new ProfileService();
