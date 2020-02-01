const Router = require('express').Router;
const router = new Router();
const Recommendation = require('../models/recommendation');


router.post('/', async (req, res, next) => {
  try {
    let recommendation = await Recommendation.create({
      user_from = req.user.username,
      user_to: req.body.to_username,
      content: req.body.content
    });
    return res.json(recommendation);
  }
  catch (e) {
    next(e);
  }
});