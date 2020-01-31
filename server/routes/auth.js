const Router = require('express').Router;
const router = new Router();
const User = require('../models/user');
const createToken = require('../helpers/createToken');


router.post('/register', async (req, res, next) => {
  try {
    const user = await User.authenticate(req.body);
    const token = createToken(user);
    return res.json({ token });
  } catch (e) {
    return next(e);
  }
});