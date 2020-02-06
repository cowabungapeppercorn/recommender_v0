const request = require('supertest');
const app = require('../../app');
const db = require('../../db');
const User = require('../../models/user');
const Rec = require('../../models/recommendation');


describe("Recommendation Routes Tests", () => {
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

    await User.register({
      username: "tester2",
      password: "password"
    });

    await User.register({
      username: "tester3",
      password: "password"
    });

    await Rec.create({
      user_from: 1,
      user_to: 2,
      content: "Watch a movie"
    });

    await Rec.create({
      user_from: 2,
      user_to: 3,
      content: "tester can't see this"
    });

    await Rec.create({
      user_from: 3,
      user_to: 1,
      content: "test this recommendation"
    });

    const res = await request(app)
      .post('/login')
      .send({
        username: "tester",
        password: "password"
      });
    _token = res.body.token;
  });

  describe("POST /recommendations", () => {
    test("Sends a recommendation", async () => {
      const data = {
        user_to: 2,
        content: "Listen to a song"
      };
      const response = await request(app)
        .post('/recommendations')
        .send({ _token, ...data });
      expect(response.statusCode).toEqual(200);
      expect(response.body.user_from).toEqual(1);
      expect(response.body.user_to).toEqual(2);
      expect(response.body.content).toEqual("Listen to a song");
    });

    test("Returns 401 if not logged in", async () => {
      const data = {
        user_to: 2,
        content: "Listen to a song"
      };
      const response = await request(app)
        .post('/recommendations')
        .send({ ...data });
      expect(response.statusCode).toEqual(401);
      expect(response.body.message).toEqual("You are not logged in.");
    });

    test("Returns 404 if user_to not found", async () => {
      const data = {
        user_to: 24,
        content: "Listen to a song"
      };
      const response = await request(app)
        .post('/recommendations')
        .send({ _token, ...data });
      expect(response.statusCode).toEqual(404);
      expect(response.body.message).toEqual("The user with an id of 24 cannot be found.");
    });
  });

  describe("GET /recommendations/received", () => {
    test("Gets all received recommendations (1 rec)", async () => {
      const response = await request(app)
        .get('/recommendations/received')
        .send({ _token });
      expect(response.statusCode).toEqual(200);
      expect(response.body.length).toEqual(1);
      expect(response.body[0].user_from).toEqual(3);
      expect(response.body[0].username_from).toEqual("tester3");
      expect(response.body[0].content).toEqual("test this recommendation");
    });

    test("Returns 401 if not logged in", async() => {
      const response = await request(app)
        .get('/recommendations/received');
      expect(response.statusCode).toEqual(401);
      expect(response.body.message).toEqual("You are not logged in.");
    });

    test("Returns 404 if no received recommendations found", async () => {
      await Rec.remove(3);
      const response = await request(app)
        .get('/recommendations/received')
        .send({ _token });
      expect(response.statusCode).toEqual(404);
      expect(response.body.message).toEqual("No received recommendations found for user with id of 1")
    });
  });

  describe("GET /recommendations/sent", () => {
    test("Gets all sent recommendations (1 rec)", async () => {
      const response = await request(app)
        .get('/recommendations/sent')
        .send({ _token });
      expect(response.statusCode).toEqual(200);
      expect(response.body.length).toEqual(1);
      expect(response.body[0].user_to).toEqual(2);
      expect(response.body[0].username_to).toEqual("tester2");
      expect(response.body[0].content).toEqual("Watch a movie");
    });

    test("Returns 401 if not logged in", async() => {
      const response = await request(app)
        .get('/recommendations/sent');
      expect(response.statusCode).toEqual(401);
      expect(response.body.message).toEqual("You are not logged in.");
    });

    test("Returns 404 if no sent recommendations found", async () => {
      await Rec.remove(1);
      const response = await request(app)
        .get('/recommendations/sent')
        .send({ _token });
      expect(response.statusCode).toEqual(404);
      expect(response.body.message).toEqual("No sent recommendations found for user with id of 1")
    });
  });

  describe("GET /recommendations/:id", () => {
    test("Gets one recommendation", async () => {
      const response = await request(app)
        .get('/recommendations/1')
        .send({ _token });
      expect(response.statusCode).toEqual(200);
      expect(response.body.to.id).toEqual(2);
      expect(response.body.from.id).toEqual(1);
      expect(response.body.content).toEqual("Watch a movie");
    });

    test("Returns 401 if not logged in", async () => {
      const response = await request(app)
        .get('/recommendations/1');
      expect(response.statusCode).toEqual(401);
      expect(response.body.message).toEqual("You are not logged in.");
    });

    test("Returns 404 if recommendation not found", async () => {
      const response = await request(app)
        .get('/recommendations/69')
        .send({ _token });
      expect(response.statusCode).toEqual(404);
      expect(response.body.message).toEqual("The recommendation with an id of '69' cannot be found.");
    });

    test("Returns 401 if user didn't send or receive recommendation", async () => {
      const response = await request(app)
        .get('/recommendations/2')
        .send({ _token });
      expect(response.statusCode).toEqual(401);
      expect(response.body.message).toEqual("You are not authorized to view this recommendation.");
    });
  });

  describe("DELETE /recommendations/:id", () => {
    test("Deletes 1 recommendation", async () => {
      const response = await request(app)
        .delete('/recommendations/1')
        .send({ _token });
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual("Recommendation with id of 1 deleted.")
    });

    test("Returns 401 if not logged in", async () => {
      const response = await request(app)
        .delete('/recommendations/1');
      expect(response.statusCode).toEqual(401);
      expect(response.body.message).toEqual("You are not logged in.");
    });

    test("Returns 401 if user didn't send recommendation", async () => {
      const response = await request(app)
        .delete('/recommendations/2')
        .send({ _token });
      expect(response.statusCode).toEqual(401);
      expect(response.body.message).toEqual("You are not authorized to perform that action.")
    });
  });
});

afterAll(async () => {
  await db.end();
});