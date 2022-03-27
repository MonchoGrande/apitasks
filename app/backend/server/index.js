const express = require('express')
const logger = require('./config/logger')
const api = require('./api/v1')
const morgan = require('morgan')

// Init app
const app = express()

// Configure headers and cors
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method'
  )
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE')
  next()
})

// Middlewares
app.use(logger.requests)

app.use(
  morgan('combined', { stream: { write: (message) => logger.info(message) } })
)
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Setup router and routes
app.use('/api', api)
app.use('/api/v1', api)

// No route found handler
app.use((req, res, next) => {
  next({
    message: 'Ruta no encontrada',
    statusCode: 404,
    level: 'warn'
  })
})

// Error handler
app.use((err, req, res, next) => {
  const { message, level = 'error' } = err
  let { statusCode = 500 } = err
  const log = `${logger.header(req)} ${statusCode} ${message}`

  // Validation Errors
  if (err.message.startsWith('validationError')) {
    statusCode = 422
  }
  logger[level](log)

  res.status(statusCode)
  res.json({
    error: true,
    statusCode,
    message
  })
})

module.exports = app
