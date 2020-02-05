const db = require('../db');


class Recommendation {

  static async getById(id) {
    const result = await db.query(
      `SELECT r.id, r.user_from, r.user_to, r.content,
              f.username AS username_from,
              t.username AS username_to
        FROM recommendations AS r
        JOIN users as f ON r.user_from = f.id
        JOIN users as t ON r.user_to = t.id
        WHERE r.id = $1`, [id]);
    const rec = result.rows[0];

    if (!rec) {
      const notFound = new Error(`The recommendation with an id of '${id}' cannot be found.`);
      notFound.status = 404;
      throw notFound;
    }

    return {
      id: rec.id,
      from: {
        id: rec.user_from,
        username: rec.username_from
      },
      to: {
        id: rec.user_to,
        username: rec.username_to
      },
      content: rec.content
    };
  }


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


  static async remove(id) {
    const result = await db.query(
      `DELETE FROM recommendations
        WHERE id = $1
        RETURNING id`, [id]);
    const deletedRec = result.rows[0];

    if (!deletedRec) {
      const notFound = new Error(`The recommendation with an id of ${id} cannot be found.`);
      notFound.status = 404;
      throw notFound;
    }

    return deletedRec;
  }

}

module.exports = Recommendation;