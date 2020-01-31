const Router = require('express').Router;
const router = new Router();
const User = require('../models/user');
const createToken = require('../helpers/createToken');


router.post('/', async (req, res, next) => {
  try {
    const user = await User.register(req.body);
    const token = createToken(user);
    return res.status(201).json({ token });
  } 
  catch (e) {
    return next(e);
  }
});

module.exports = router;