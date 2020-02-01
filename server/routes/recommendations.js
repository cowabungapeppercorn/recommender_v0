const Router = require('express').Router;
const router = new Router();
const Recommendation = require('../models/recommendation');
const User = require('../models/user');
const { ensureLoggedIn } = require('../middleware/auth');


router.get('/:id', ensureLoggedIn, async (req, res, next) => {
  try {
    const rec = await Recommendation.getById(req.params.id);
    const user = await User.getByUsername(req.user.username);

    if (rec.user_to === user.id || rec.user_from === user.id) {
      return res.json(rec);
    } else {
      const notAuthorizedErr = new Error("You are not authorized to perform that action.");
      notAuthorizedErr.status = 401;
      throw notAuthorizedErr;
    }
  }
  catch (e) {
    return next(e);
  }
});


router.post('/', ensureLoggedIn, async (req, res, next) => {
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
    return next(e);
  }
});

module.exports = router;