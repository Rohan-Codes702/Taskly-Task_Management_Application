const mongoose = require('mongoose');

let mongodInstance = null;

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (mongoUri) {
      try {
        await mongoose.connect(mongoUri);
        console.log('MongoDB Connected (remote)');
        return;
      } catch (remoteErr) {
        console.warn('Remote MongoDB connect failed:', remoteErr.message);
        // If in production, do not fallback
        if (process.env.NODE_ENV === 'production') {
          throw remoteErr;
        }
        console.warn('Falling back to in-memory MongoDB for local development');
      }
    }

    // Fallback to in-memory MongoDB for local development
    const { MongoMemoryServer } = require('mongodb-memory-server');
    mongodInstance = await MongoMemoryServer.create();
    const uri = mongodInstance.getUri();
    await mongoose.connect(uri);
    console.log('MongoDB Connected (in-memory)');
    return;
  } catch (error) {
    console.error('DB Connection Error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;