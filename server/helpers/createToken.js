const jwt = require('jsonwebtoken');
const { SECRET } = require('../config');

function createToken(user) {
  let payload = {
    id: user.id,
    username: user.username,
    is_admin: user.is_admin
  };

  return jwt.sign(payload, SECRET);
}

module.exports = createToken;