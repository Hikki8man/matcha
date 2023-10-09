const db = require("../dbconnect");

class QueryBuilder {
  constructor() {
    this.query = "";
    this.values = [];
    this.valueNb = 0;
    this.alias = "";
  }
  create(alias) {
    this.alias = alias;
    this.query = "";
    this.values = [];
    this.valueNb = 0;
    return this;
  }

  select(columns) {
    if (!columns) {
      this.query += `SELECT ${this.alias}.* `;
    } else if (!Array.isArray(columns) || columns.length === 0) {
      throw new Error("Invalid columns for SELECT statement");
    } else {
      this.query += `SELECT ${columns
        .map((column) => `${this.alias}.${column}`)
        .join(", ")} `;
    }
    return this;
  }

  returning(columns) {
    if (!columns) {
      this.query += `RETURNING * `;
    } else if (!Array.isArray(columns) || columns.length === 0) {
      throw new Error("Invalid columns for RETURNING statement");
    } else {
      this.query += `RETURNING ${columns.join(", ")} `;
    }
    return this;
  }

  where(condition) {
    // this.values.push(value);
    // this.valueNb += 1;
    this.query += `WHERE ${condition} `;
    return this;
  }

  insert(data, table) {
    // console.log(values);
    const columns = Object.keys(data);
    const values = Object.values(data);
    this.values.push(...values);
    this.query += `INSERT INTO ${table} (${columns.join(
      ", "
    )}) VALUES (${columns
      .map((_, _i) => {
        this.valueNb += 1;
        return `$${this.valueNb}`;
      })
      .join(", ")}) `;
    return this;
  }

  update(data, table) {
    const columns = Object.keys(data);
    const values = Object.values(data);
    this.values.push(...values);
    const setClause = columns
      .map((column, _i) => {
        this.valueNb += 1;
        return `${column} = $${this.valueNb}`;
      })
      .join(", ");
    this.query += `UPDATE ${table} SET ${setClause} `;
    return this;
  }

  innerJoin(table, sourceColumn, targetColumn, targetAlias) {
    this.query += `INNER JOIN "${table}" "${targetAlias}" ON ${this.alias}.${sourceColumn} = ${targetAlias}.${targetColumn} `;
    return this;
  }

  from(tableName) {
    this.query += `FROM "${tableName}" "${this.alias}" `;
    return this;
  }

  print() {
    console.log("query:", this.query, ",", this.values);
    return this;
  }
  getOne() {
    return db.one(this.query, this.values);
  }

  getNone() {
    return db.none(this.query, this.values);
  }

  getOneOrNone() {
    return db.oneOrNone(this.query, this.values);
  }

  getMany() {
    return db.many(this.query, this.values);
  }

  getManyOrNone() {
    return db.manyOrNone(this.query, this.values);
  }
}

const qb = new QueryBuilder();

const test = async () => {
  try {
    // const user = await qb
    //   .create()
    //   .insert({email: "deadfsdfsdsdda"}, "user_account")
    //   .returning()
    //   .print();

    // const update = await qb
    //   .create()
    //   .update({email: "deadfsdfsda", id: 2}, "user_account")
    //   .where("id", 2)
    //   // .returning()
    //   .print();
    // .getOne();

    const likere = await qb
      .create("user")
      .select()
      .from("user_account")
      .where(`user.id = ${1}`)
      .print()
      .getOne();

    // const likers = await qb
    //   .create("profile")
    //   .select()
    //   .from("profile")
    //   // .innerJoin("likes", "user_id", "liked_id", "l")
    //   .where(`profile.user_id = ${1}`)
    //   .print()
    //   .getManyOrNone();
    console.log("likers", likere);
  } catch (err) {
    console.log(err);
  }
};

// qb.create().insert({name: "testo", id: 3}).into("User").print();
// test();

// qb.create().select(["id", "name"]).from("User").where("id", 2).print();

module.exports = new QueryBuilder();
