const request = require('supertest');
const jwt = require('jsonwebtoken');

const app = require('../app');
const db = require('../db');
const User = require('../models/user');


describe("Auth Routes Tests", () => {

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

  describe("POST /login", () => {

    test("User can login and receive correct token in response.", async () => {
      const response = await request(app)
        .post('/login')
        .send({ username: "tester", password: "password" });
      const token = response.body.token;
      expect(jwt.decode(token)).toEqual({
        iat: expect.any(Number),
        username: "tester",
        is_admin: false
      });
    });

    test("Cannot login with invalid password.", async () => {
      const response = await request(app)
        .post('/login')
        .send({ username: "tester", password: "dingdong" });
      expect(response.statusCode).toEqual(401);
      expect(response.body.message).toEqual("Invalid Credentials");
    });

    test("Cannot login with invalid username.", async () => {
      const response = await request(app)
        .post('/login')
        .send({ username: "jabroni", password: "password" });
      expect(response.statusCode).toEqual(401);
      expect(response.body.message).toEqual("Invalid Credentials");
    });
    
  });

});

afterAll(async () => {
  await db.end();
});