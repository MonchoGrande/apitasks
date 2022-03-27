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
  pagination: {
    limit: 10,
    skip: 0,
    page: 1,
  },
  sort: {
    sortBy: {
      default: 'createdAt',
      fields: ['createdAt', 'updatedAt'],
    },
    direction: {
      default: 'desc',
      options: ['asc', 'asc'],
    },
  },
  populate: {
    virtuals: {
      limit: 20,
      sort: 'createAt',
      direction: 'asc',
    },
  },
  token: {
    secret: process.env.TOKEN_SECRET,
    expires: process.env.TOKEN_EXPIRES,
  }
};

module.exports = config;
