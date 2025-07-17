const mongoose = require('mongoose');

// MongoDB connection URI
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/myapp';

// Create a connection to MongoDB
const mongoDb = mongoose.createConnection(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoDb
  .asPromise()
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

module.exports = {
  mongoDb,
};
