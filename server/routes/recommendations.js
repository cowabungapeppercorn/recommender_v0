const Router = require('express').Router;
const router = new Router();
const Recommendation = require('../models/recommendation');
const User = require('../models/user');
const { ensureLoggedIn } = require('../middleware/auth');


router.get('/received', ensureLoggedIn, async (req, res, next) => {
  try {
    const recs = await User.getAllReceivedRecs(req.user.id);
    return res.json(recs);
  }
  catch (e) {
    return next(e);
  }
});


router.get('/sent', ensureLoggedIn, async (req, res, next) => {
  try {
    const recs = await User.getAllSentRecs(req.user.id);
    return res.json(recs);
  }
  catch (e) {
    return next(e);
  }
});


router.get('/:id', ensureLoggedIn, async (req, res, next) => {
  try {
    const rec = await Recommendation.getById(req.params.id);
    const user = await User.getById(req.user.id);

    if (rec.from.id === user.id || rec.to.id === user.id) {
      return res.json(rec);
    } else {
      const notAuthorizedErr = new Error("You are not authorized to view this recommendation.");
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
    const userFrom = await User.getById(req.user.id);
    const userTo = await User.getById(req.body.user_to);

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


router.delete('/:id', ensureLoggedIn, async (req, res, next) => {
  try {
    const rec = await Recommendation.getById(req.params.id);
    if (req.user.id !== rec.from.id && req.user.id !== rec.to.id) {
      const notAuthorizedErr = new Error("You are not authorized to perform that action.");
      notAuthorizedErr.status = 401;
      throw notAuthorizedErr;
    } else {
      const deletedRec = await Recommendation.remove(req.params.id);
      return res.json(`Recommendation with id of ${deletedRec.id} deleted.`);
    }
  }
  catch (e) {
    return next(e);
  }
});

module.exports = router;