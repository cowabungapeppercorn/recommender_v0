const db = require('../db');
const { BCRYPT_WORK_FACTOR } = require('../config');
const bcrypt = require('bcrypt');


class User {

  static async register(data) {
    const duplicateCheck = await db.query(
      `SELECT username FROM users
        WHERE username = $1`,
        [data.username]
    );

    if (duplicateCheck.rows[0]) {
      const err = new Error(
        `The username ${data.username} is taken.`);
      err.status = 409;
      throw err;
    }

    const hashedPassword = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);

    const result = await db.query(
      `INSERT INTO users (
        username,
        password)
        VALUES ($1, $2)
        RETURNING username, is_admin`,
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


  static async getAll() {
    const usersRes = await db.query(
      `SELECT id, username FROM users
        ORDER BY username`);

    if (!usersRes.rows.length) {
      const error = new Error("No users found.");
      error.status = 404;
      throw error;
    }
    
    return usersRes.rows;
  }


  static async getByUsername(username) {
    const result = await db.query(
      `SELECT id, username FROM users
        WHERE username = $1`, [username]);
    const user = result.rows[0];
    
    if (!user) {
      const error = new Error(`The user '${username}' cannot be found.`);
      error.status = 404;
      throw error;
    }
    
    return user;
  }

}

module.exports = User;