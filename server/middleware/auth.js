const jwt = require('jsonwebtoken');
const { SECRET } = require('../config');


const authenticateJWT = (req, res, next) => {
  try {
    const tokenFromBody = req.body._token;
    const payload = jwt.verify(tokenFromBody, SECRET);
    req.user = payload;
    return next();
  }
  catch (e) {
    return next();
  }
};


const ensureLoggedIn = (req, res, next) => {
  if (req.user) {
    return next()
  } else {
    const notLoggedInErr = new Error("You are not logged in.");
    notLoggedInErr.status = 401;
    throw notLoggedInErr;
  }
};


const ensureCorrectUser = (req, res, next) => {
  if (req.user.username === req.params.username) {
    return next();
  } else {
    const notAuthorizedErr = new Error("You are not authorized to perform that action.");
    notAuthorizedErr.status = 401;
    throw notAuthorizedErr;
  }
};


module.exports = {
  authenticateJWT,
  ensureLoggedIn,
  ensureCorrectUser
};