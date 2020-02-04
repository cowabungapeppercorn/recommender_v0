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
      const userInDb = await User.getById(2);

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

    test("Returns 401 if not logged in", async () => {
      const response = await request(app)
        .get('/users');
      expect(response.statusCode).toEqual(401);
      expect(response.body.message).toEqual("You are not logged in.");
    });
  });

  describe("GET /users/:id", () => {
    test("Gets one user", async () => {
      const response = await request(app)
        .get('/users/1')
        .send({ _token });
      const user = response.body.user;
      expect(user.username).toEqual("tester");
      expect(user.id).toEqual(1);
    });

    test("Returns 401 if not logged in", async () => {
      const response = await request(app)
        .get('/users/1');
      expect(response.statusCode).toEqual(401);
      expect(response.body.message).toEqual("You are not logged in.");
    });

    test("Returns 404 if user not found", async () => {
      const response = await request(app)
        .get("/users/69420")
        .send({ _token });
      expect(response.statusCode).toEqual(404);
      expect(response.body.message).toEqual("The user with an id of 69420 cannot be found.");
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