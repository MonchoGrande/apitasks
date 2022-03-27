const { Model, fields, references, virtuals } = require('./model');
const { paginationParseParams } = require('../../../utils');
const { sortParseParams, sortCompactToStr } = require('../../../utils');
const { populateToObject } = require('../../../utils');

const referencesNames = [
  ...Object.getOwnPropertyNames(references),
  ...Object.getOwnPropertyNames(virtuals),
];

const id = async (req, res, next, id) => {
  const populate = referencesNames.join(' ');
  try {
    const doc = await Model.findById(id).populate(populate).exec();
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
const create = async (req, res, next) => {
  const { body = {}, decoded = {} } = req;
  const { _id = null } = decoded;
  if (_id) {
    body.userId = _id;
  }

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
const all = async (req, res, next) => {
  const { query = {} } = req;

  const { limit, page, skip } = paginationParseParams(query);
  const { sortBy, direction } = sortParseParams(query, fields);

  const populate = populateToObject(referencesNames, virtuals);
  
  const all = Model.find({})
    .sort(sortCompactToStr(sortBy, direction))
    .skip(skip)
    .limit(limit)
    .populate(populate);
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
      message: `El grupo: ${removed.nombre}ha sido eliminado correctamente`
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
  create,
  update,
};
