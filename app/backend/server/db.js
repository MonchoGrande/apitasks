const mongoose = require('mongoose');

exports.connect = (
  { protocol = 'mongodb', url, username = '', password = '' },
  options = {}
) => {
  let dburl = '';

  // Requiered auth
  if (username && password) {
    dburl = `${protocol}://${username}:${password}@${url}`;
  } else {
    dburl = `${protocol}://${url}`;
  }

  mongoose.connect(dburl, {
    ...options,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  mongoose.connection.on('open', () => {
    console.log('Database connected');
  });

  mongoose.connection.on('close', () => {
    console.log('Database disconnected');
  });

  mongoose.connection.on('error', (err) => {
    console.log(`Database connection error: ${err}`);
  });

  process.on('SIGINT', () => {
    mongoose.connection.close(() => {
      console.log('Database connection disconnected trough app termination');
      process.exit(0);
    });
  });
};

exports.disconnect = () => {
  mongoose.connection.close(() => {
    console.log('Database disconnected');
  });
};
