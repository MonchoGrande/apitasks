require('dotenv').config('');

const config = {
  server: {
    host: process.env.APP_HOST,
    port: process.env.SERVER_PORT,
  },
  database: {
    protocol: process.env.DATABASE_PROTOCOL,
    url: process.env.DATABASE_URL,
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
  },
};

module.exports = config;
