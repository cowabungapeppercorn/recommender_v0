const Router = require('express').Router;
const router = new Router();
const Recommendation = require('../models/recommendation');
const User = require('../models/user');


router.post('/', async (req, res, next) => {
  try {
    const userFrom = await User.getByUsername(req.user.username);
    const userTo = await User.getByUsername(req.body.user_to);

    const recommendation = await Recommendation.create({
      user_to: userTo.id,
      user_from: userFrom.id,
      content: req.body.content
    });
    return res.json(recommendation);
  }
  catch (e) {
    next(e);
  }
});

module.exports = router;