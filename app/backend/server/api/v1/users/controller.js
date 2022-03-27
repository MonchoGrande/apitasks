const { Model, fields, references } = require('./model');
const { signToken } = require('./../auth');
const { paginationParseParams } = require('./../../../utils');
const { sortParseParams, sortCompactToStr } = require('./../../../utils');

const id = async (req, res, next, id) => {
  try {
    const doc = await Model.findById(id).exec();
    if (!doc) {
      const message = `${Model.modelName} no encontrado`;
      next({
        message,
        statusCode: 404,
      });
    } else {
      req.doc = doc;
      next();
    }
  } catch (err) {
    next(new Error(err));
  }
};
const signup = async (req, res, next) => {
  const { body = {} } = req;

  const document = new Model(body);

  try {
    const doc = await document.save();

    res.status(201);
    res.json({
      success: true,
      data: doc,
    });
  } catch (err) {
    next(new Error(err));
  }
};
const signin = async (req, res, next) => {
  const { body = {} } = req;
  const { email = '', password = '' } = body;

  try {
    const user = await Model.findOne({ email }).exec();

    if (!user) {
      const message = 'Email o password incorrectos';

      return next({
        success: false,
        message,
        statusCode: 401,
      });
    }
    const verified = await user.verifyPassword(password);
    if (!verified) {
      const message = 'Email o password incorrectos';

      return next({
        success: false,
        message,
        statusCode: 401,
      });
    }
    const { _id } = user;
    const token = signToken({ _id });
    console.log(token);
    return res.json({
      success: true,
      data: user,
      meta: {
        token,
      },
    });
   
  } catch (err) {
    return next(new Error(err));
  }
};
const all = async (req, res, next) => {
  const { query = {} } = req;
  const { limit, page, skip } = paginationParseParams(query);
  const { sortBy, direction } = sortParseParams(query, fields);

  const all = Model.find({})
    .sort(sortCompactToStr(sortBy, direction))
    .skip(skip)
    .limit(limit);

  const count = Model.countDocuments();
  try {
    const data = await Promise.all([all.exec(), count.exec()]);
    const [docs, total] = data;
    const pages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: docs,
      meta: {
        limit,
        skip,
        total,
        page,
        pages,
        sortBy,
        direction,
      },
    });
  } catch (err) {
    next(new Error(err));
  }
};

const read = async (req, res, next) => {
  const { doc = {} } = req;

  res.json({
    success: true,
    data: doc,
  });
};
const update = async (req, res, next) => {
  const { doc = {}, body = {} } = req;
  Object.assign(doc, body);

  try {
    const updated = await doc.save();
    res.json({
      succes: true,
      data: updated,
    });
  } catch (err) {
    next(new Error(err));
  }
};

const deleted = async (req, res, next) => {
  const { doc = {} } = req;

  try {
    const removed = await doc.remove();
    res.json({
      succes: true,
      message: `El usuario ${removed.nombre} ${removed.apellidos} ha sido eliminado correctamente`,
    });
  } catch (err) {
    next(new Error(err));
  }
};

module.exports = {
  read,
  all,
  deleted,
  id,
  signin,
  update,
  signup,
};
