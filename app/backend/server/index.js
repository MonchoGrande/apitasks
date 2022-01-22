const express = require('express');
const app = express();
const routes = require('../routes');

//Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(routes);

// No route found handler
app.use((req, res, next) => {
  const message = 'Ruta no encontrada';
  const statusCode = 404;

  res.status(statusCode);
  res.json({
    message,
  });
});

// Error handler
app.use((err, req, res, next) => {
  const { message, statusCode = 500 } = err;

  res.status(statusCode);
  res.json({
    error: true,
    message,
    statusCode,
  });
});

module.exports = app;
