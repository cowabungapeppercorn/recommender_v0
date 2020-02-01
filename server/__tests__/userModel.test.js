const db = require('../db');
const User = require('../models/user');


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

    test("Throws 409 error when trying to register duplicate username", async () => {
      try {
        await User.register({
          username: "tester",
          password: "password"
        });
      } catch (e) {
        return e;
      }
      expect(409);
      expect(e.body.message).toEqual("The username 'tester' is taken.");
    });

    /** LEFT OFF HERE 2/1**/
    /** LEFT OFF HERE **/
    /** LEFT OFF HERE 2/1**/
    /** LEFT OFF HERE **/
    /** LEFT OFF HERE 2/1**/
    /** LEFT OFF HERE **/
    /** LEFT OFF HERE 2/1**/
    /** LEFT OFF HERE **/
    /** LEFT OFF HERE 2/1**/
    /** LEFT OFF HERE **/

    test("Throws error when user object incomplete", async () => {
      try {
        await User.register({
          username: "notgonnawork"
        });
      } catch (e) {
        console.log("ERROR ------->", e);
        return e;
      }
      expect(500);
    });

  });

});

afterAll(async () => {
  await db.end();
});