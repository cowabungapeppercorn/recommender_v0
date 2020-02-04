const db = require('../../db');
const User = require('../../models/user');


describe("User Model Tests", () => {
  beforeEach(async () => {
    await db.query("DELETE FROM recommendations");
    await db.query("DELETE FROM users");
    await db.query("ALTER SEQUENCE recommendations_id_seq RESTART WITH 1");
    await db.query("ALTER SEQUENCE users_id_seq RESTART WITH 1");

    await User.register({
      "username": "tester",
      "password": "password"
    });
  });

  describe("Register method", () => {
    test("Register returns username and is_admin", async () => {
      const user = await User.register({
        username: "testing",
        password: "password"
      });

      expect(user.username).toEqual("testing");
      expect(user.is_admin).toEqual(false);
    });

    test("Registered user is in database", async () => {
      const result = await db.query("SELECT * FROM users WHERE id = 1");
      const user = result.rows[0];
      expect(user.username).toEqual("tester");
      expect(user.password).toEqual(expect.any(String));
      expect(user.id).toEqual(1);
      expect(user.is_admin).toEqual(false);
    });

    test("Throws 400 error if username not included", async () => {
      try {
        await User.register({ password: "password" });
      } catch (e) {
        expect(e.status).toEqual(400);
        expect(e.message).toEqual("Must provide a username.")
      }
    });

    test("Throws 400 error if password not included", async () => {
      try {
        await User.register({ username: "testing" });
      } catch (e) {
        expect(e.status).toEqual(400);
        expect(e.message).toEqual("Must provide a password.")
      }
    });
  });
});

afterAll(async () => {
  await db.end();
});