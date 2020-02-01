const db = require('../db');


class Recommendation {

  static async create({ user_from, user_to, content }) {
    const result = await db.query(
      `INSERT INTO recommendations (
          user_from,
          user_to,
          content)
        VALUES ($1, $2, $3)
        RETURNING id, user_from, user_to, content`,
        [user_from, user_to, content]);

    return result.rows[0];
  }

}

module.exports = Recommendation;