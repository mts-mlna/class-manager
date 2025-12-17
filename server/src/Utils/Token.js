const jwt = require('jsonwebtoken');
require('dotenv').config();

/* ===============================
   TOKEN DE VERIFICACIÓN DE EMAIL
================================ */

const genEmailToken = (email) => {
  return jwt.sign(
    { email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

const verifyEmailToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

/* ===============================
   TOKEN DE LOGIN (SESIÓN)
================================ */

const genLoginToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email
    },
    process.env.JWT_SECRET,
    { expiresIn: '2h' }
  );
};

const verifyLoginToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = {
  genEmailToken,
  verifyEmailToken,
  genLoginToken,
  verifyLoginToken
};
