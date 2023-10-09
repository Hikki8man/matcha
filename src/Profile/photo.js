const db = require("../dbconnect");

class photoRepository {
  async insert(user_id, file) {
    const {filename, path, size} = file;
    console.log("userid", user_id);
    try {
      await db.none(
        "INSERT INTO photo(user_id, filename, path, size) VALUES($1, $2, $3, $4)",
        [user_id, filename, path, size]
      );
    } catch (err) {
      console.log("err", err);
    }
  }

  async getByProfileId(id) {
    try {
      return await db.one(`SELECT * FROM photo WHERE user_id = $1`, id);
    } catch (err) {
      console.log(err);
    }
  }
}
module.exports = new photoRepository();
