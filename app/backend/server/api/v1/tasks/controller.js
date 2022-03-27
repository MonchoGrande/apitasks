const { Model, fields, references } = require('./model')
const { paginationParseParams } = require('../../../utils')
const { sortParseParams, sortCompactToStr } = require('../../../utils')
const { filterByNested } = require('../../../utils')
const { Model: User } = require('../users/model')

const referencesNames = Object.getOwnPropertyNames(references)

const parentId = async (req, res, next) => {
  const { params = {} } = req

  const { userId = null } = params

  if (userId) {
    try {
      const doc = await User.findById(userId).exec()

      if (doc) {
        next()
      } else {
        const message = 'Usuario no encontrado'
        next({
          succes: false,
          message,
          statusCode: 404
        })
      }
    } catch (err) {
      next(new Error(err))
    }
  } else {
    next()
  }
}

const id = async (req, res, next, id) => {
  const populate = referencesNames.join(' ')
  try {
    const doc = await Model.findById(id).populate(populate).exec()
    if (!doc) {
      const message = `${Model.modelName} no encontrado`
      next({
        message,
        statusCode: 404
      })
    } else {
      req.doc = doc
      next()
    }
  } catch (err) {
    next(new Error(err))
  }
}
const create = async (req, res, next) => {
  const { body = {}, params = {}, decoded = {} } = req

  const { _id = null } = decoded
  if (_id) {
    body.userId = _id
  }
  const fecha = new Date()

  Object.assign(body, params)

  const document = new Model(body)

  try {
    const doc = await document.save()
    res.status(201)
    res.json({
      success: true,
      data: doc
    })
  } catch (err) {
    next(new Error(err))
  }
}
const all = async (req, res, next) => {
  const { query = {}, params = {} } = req
  const { limit, page, skip } = paginationParseParams(query)
  const { sortBy, direction } = sortParseParams(query, fields)
  const { filters, populate } = filterByNested(params, referencesNames)

  const all = Model.find({})
    .sort(sortCompactToStr(sortBy, direction))
    .skip(skip)
    .limit(limit)
    .populate(populate)
  const count = Model.countDocuments(filters)
  try {
    const data = await Promise.all([all.exec(), count.exec()])
    const [docs, total] = data
    const pages = Math.ceil(total / limit)

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
        direction
      }
    })
  } catch (err) {
    next(new Error(err))
  }
}

const read = async (req, res, next) => {
  const { doc = {} } = req
  console.log(doc)
  const { id = null } = req.params

  try {
    const doc = await Model.findById(id)
    if (!doc) {
      const message = 'Esta tarea no existe'

      next({
        message,
        statusCode: 404
      })
    } else {
      res.json(doc)
    }
  } catch (err) {
    next(new Error(err))
  }
  res.json({
    success: true,
    data: doc
  })
}
const update = async (req, res, next) => {
  const { doc = {}, body = {}, params = {} } = req
  Object.assign(doc, body, params)

  try {
    const updated = await doc.save()
    res.json({
      succes: true,
      data: updated
    })
  } catch (err) {
    next(new Error(err))
  }
}

const deleted = async (req, res, next) => {
  const { doc = {} } = req

  try {
    const removed = await doc.remove()
    res.json({
      succes: true,
      message: `La tarea con numero: ${removed._id} ha sido eliminada correctamente`
    })
  } catch (err) {
    next(new Error(err))
  }
}

module.exports = {
  read,
  all,
  deleted,
  id,
  create,
  update,
  parentId
}
