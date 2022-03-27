const { createLogger, format, transports } = require('winston');
const morgan = require('morgan');

//Setup loggers for
const logger = createLogger({
  format: format.simple(),
  transports: [new transports.Console()],
});

//request loggers
morgan.token('id', (req) => req.id);

const requestFormat = 'remote-addr [:date[iso] :id":method :url" :status';

const requests = morgan(requestFormat, {
  stream: {
    write: (message) => {
      const log = message;
      return logger.info(log);
    },
  },
});

logger.requests = requests;

logger.header = (req) => {
  const date = new Date().toISOString();
  return `${req.ip} [${date}] "${req.method} ${req.originalUrl}`;
};

module.exports = logger;
