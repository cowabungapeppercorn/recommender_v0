const request = require('supertest');
const app = require('../../app');
const db = require('../../db');
const User = require('../../models/user');


describe("User Routes Tests", () => {
  let _token;
  beforeEach(async () => {
    await db.query("DELETE FROM recommendations");
    await db.query("DELETE FROM users");
    await db.query("ALTER SEQUENCE recommendations_id_seq RESTART WITH 1");
    await db.query("ALTER SEQUENCE users_id_seq RESTART WITH 1");

    await User.register({
      username: "tester",
      password: "password"
    });

    const res = await request(app)
      .post('/login')
      .send({
        username: "tester",
        password: "password"
      });
    _token = res.body.token;
  });

  describe("POST /users", () => {
    test("Creates a new user", async () => {
      const data = {
        username: "johnbasedowfan",
        password: "password"
      };
      const response = await request(app)
        .post('/users')
        .send(data);
      const userInDb = await User.getByUsername("johnbasedowfan");

      expect(response.statusCode).toEqual(201);
      expect(response.body).toHaveProperty("token");
      expect(userInDb.username).toEqual(data.username);
      expect(userInDb.id).toEqual(expect.any(Number));
    });

    test("Prevents creation of user with duplicate username", async () => {
      const data = {
        "username": "tester",
        "password": "password"
      };
      const response = await request(app)
        .post('/users')
        .send(data);
      expect(response.statusCode).toEqual(409);
      expect(response.body.message).toEqual("The username tester is taken.");
    });

    test("Prevents creation of user without providing password field", async () => {
      const data = {
        "username": "testerino",
        "password": ""
      };
      const response = await request(app)
        .post('/users')
        .send(data);
      expect(response.statusCode).toEqual(400);
      expect(response.body.message).toEqual("Must provide a password.");
    })
  });

  describe("GET /users", () => {
    test("Gets a list of all users (1 user)", async () => {
      const response = await request(app)
        .get('/users')
        .send({ _token });
      expect(response.body.users[0]).toHaveProperty("username");
      expect(response.body.users[0]).toHaveProperty("id");
      expect(response.body.users[0]).not.toHaveProperty("password");
    });
  });
});

/** LEFT OFF HERE 2/2 **/
/** LEFT OFF HERE 2/2 **/
/** LEFT OFF HERE 2/2 **/
/** LEFT OFF HERE 2/2 **/
/** LEFT OFF HERE 2/2 **/
/** LEFT OFF HERE 2/2 **/

afterAll(async () => {
  await db.end();
});