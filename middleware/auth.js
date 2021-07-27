const jwt = require('jsonwebtoken');
const config = require('config');

const authenticate = (req, res, next) => {
  const authHeader = req.header('authorization');
  const token = authHeader && authHeader.split(' ')[1];

  if (token === null) return res.status(401).json({ msg: 'No token, authorization denied' });

  jwt.verify(token, config.get('jwtSecret'), (err, token) => {
    if (err) {
      console.error(err.message);
      return res.status(401).send('User not authorized');
    }

    req.user = token.user;

    next()
  })
}

module.exports = authenticate;