const mongoose = require('mongoose');
const config = require('config');

const connect = async () => {
  try {
    await mongoose.connect(config.get('mongoURI'),
      { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}

module.exports = connect;