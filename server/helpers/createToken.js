const jwt = require('jsonwebtoken');
const { SECRET } = require('../config');

function createToken(user) {
  let payload = {
    username: user.username,
    is_admin: user.is_admin
  };

  return jwt.sign(payload, SECRET);
}

module.exports = createToken;