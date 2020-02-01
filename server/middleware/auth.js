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

module.exports = {
  authenticateJWT
};