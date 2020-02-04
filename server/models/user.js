const db = require('../db');
const { BCRYPT_WORK_FACTOR } = require('../config');
const bcrypt = require('bcrypt');
const partialUpdate = require('../helpers/partialUpdate');


class User {

  static async register(data) {
    const argumentsCheck = (data) => {
      let errMsg = "";
      if (!data.username) {
        errMsg += " Must provide a username.";
      }
      if (!data.password) {
        errMsg += " Must provide a password.";
      }
      if (errMsg.length > 0) {
        const err = new Error(errMsg.slice(1));
        err.status = 400;
        throw err;
      }
    }

    const duplicateCheck = await db.query(
      `SELECT username FROM users
        WHERE username = $1`,
        [data.username]
    );

    argumentsCheck(data);
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
        RETURNING id, username, is_admin`,
      [data.username, hashedPassword]);
    
    return result.rows[0];
  }


  static async authenticate(data) {
    const result = await db.query(
      `SELECT id, username, password, is_admin FROM users
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


  static async getById(id) {
    const result = await db.query(
      `SELECT id, username FROM users
        WHERE id = $1`, [id]);
    const user = result.rows[0];
    
    if (!user) {
      const notFound = new Error(`The user with an id of ${id} cannot be found.`);
      notFound.status = 404;
      throw notFound;
    }
    
    return user;
  }


  static async getAllReceivedRecs(id) {
    const result = await db.query(
      `SELECT r.id, r.user_from, r.content,
              f.username AS username_from
        FROM recommendations AS r
        JOIN users as f ON r.user_from = f.id
        WHERE r.user_to = $1`, [id]);
    const recs = result.rows;

    if (!recs.length) {
      const noRecsErr = new Error(`No recommendations found for user with id of ${id}`);
      noRecsErr.status = 404;
      throw noRecsErr;
    }

    return recs;
  }


  static async update(id, data) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
    }

    const { query, values } = partialUpdate(
      'users',
      data,
      'id',
      id
    );

    const result = await db.query(query, values);
    const user = result.rows[0];

    if (!user) {
      const notFound = new Error(`The user with an id of ${id} cannot be found.`);
      notFound.status = 404;
      throw notFound;
    }

    delete user.password;
    delete user.is_admin;

    return user;
  }


  static async remove(id) {
    const result = await db.query(
      `DELETE FROM users
        WHERE id = $1
        RETURNING username`, [id]);
      const user = result.rows[0];

    if (!user) {
      const notFound = new Error(`The user with an id of ${id} cannot be found.`);
      notFound.status = 404;
      throw notFound;
    }

    return user;
  }

}

module.exports = User;