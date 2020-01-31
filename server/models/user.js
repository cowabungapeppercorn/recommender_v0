const db = require('../db');
const { BCRYPT_WORK_FACTOR } = require('../config');
const bcrypt = require('bcrypt');


class User {

  static async register(data) {
    let hashedPassword = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);

    const result = await db.query(
      `INSERT INTO users (
        username,
        password)
        VALUES ($1, $2)`
      [data.username, hashedPassword]);

    return result.rows[0];
  }


  static async authenticate(data) {
    const result = await db.query(
      `SELECT password FROM users
        WHERE username = $1`,
        [data.username]);
    const user = result.rows[0];

    if (user) {
      const isValid = await bcrypt.compare(data.password, user.password)
      if (isValid) {
        return user;
      }
    }

    const invalidPass = new Error("Invalid Credentials");
    invalidPass.status = 401;
    throw invalidPass;
  }

}

module.exports = User;