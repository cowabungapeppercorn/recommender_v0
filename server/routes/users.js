const Router = require('express').Router;
const router = new Router();
const User = require('../models/user');
const createToken = require('../helpers/createToken');


/** CRUD ROUTES FOR USER **/


router.get('/', async (req, res, next) => {
  try {
    const users = await User.getAll();
    return res.json({ users });
  }
  catch (e) {
    return next (e);
  }
});


router.get('/:username', async (req, res, next) => {
  try {
    const user = await User.getByUsername(req.params.username);
    return res.json({ user });
  }
  catch(e) {
    return next(e);
  }
});


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


router.patch('/:username', async (req, res, next) => {
  try{
    const user = await User.update(req.params.username, req.body);
    return res.json({ user });
  }
  catch (e) {
    return next(e);
  }
});


router.delete('/:username', async (req, res, next) => {
  try {
    const user = await User.remove(req.params.username);
    return res.json({ message: `User '${user.username}' deleted.` });
  }
  catch (e) {
    return next(e);
  }
});

module.exports = router;