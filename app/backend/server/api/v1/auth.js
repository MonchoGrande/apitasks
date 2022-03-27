const { Model: User } = require('./users/model');
const { sign, verify } = require('jsonwebtoken');

const config = require('../../config');
const { rejections } = require('../../config/logger');

const { secret, expires } = config.token;

const signToken = (payload, expiresIn = expires) =>
  sign(payload, secret, {
    algorithm: 'HS256',
    expiresIn,
  });

const auth = (req, res, next) => {
  let token = req.headers.authorization || req.query.token || '';
  console.log(token);
  if (token.startsWith('Bearer ')) {
    token = token.substring(7);
  }
  if (!token) {
    const message = 'No tiene permisos para acceder';

    next({
      success: false,
      message,
      statusCode: 401,
    });
  } else {
    verify(token, config.token.secret, (err, decoded) => {
      if (err) {
        const message = 'No tiene permisos para acceder';

        next({
          success: false,
          message,
          statusCode: 401,
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  }
};

const verifyAdmin = async (req, res, next) => {
  const { decoded = {} } = req;
  const { _id } = decoded;

  try {
    const doc = await User.findOne({ _id }).exec();

    if (doc.role !== 'admin') {
      const message = 'No tiene permisos para acceder';

      next({ success: false, message, statusCode: 403 });
    } else {
      next();
    }
  } catch (err) {
    next(new Error(err));
  }
};
// const me = (req, res, next) => {
//   const { decoded = {}, params = {} } = req;
//   const { _id } = decoded;
//   const { id } = params;

//   if (_id !== id) {
//     const message = 'No tiene permisos para acceder';

//     next({ success: false, message, statusCode: 403 });
//   } else {
//     next();
//   }
// };
const owner = (req, res, next) => {
  const { decoded = {}, doc = {} } = req;
  console.log(doc);
  const { _id } = decoded;
  const { id } = doc.userId;
  if (_id !== id) {
    const message = 'No tiene permisos para acceder';

    next({ success: false, message, statusCode: 403 });
  } else {
    next();
  }
};

module.exports = { signToken, auth, verifyAdmin,owner };
