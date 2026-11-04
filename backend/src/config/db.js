const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/taskflow';
    
    const conn = await mongoose.connect(mongoURI);

    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[Database Error] Failed to connect to MongoDB: ${error.message}`);
    // In production/Docker/K8s, we let the container restart or keep retrying
    if (process.env.NODE_ENV === 'production') {
      console.warn('[Database] Running in production mode. Will retry connection on demand.');
    }
  }
};

// Monitor connection events
mongoose.connection.on('disconnected', () => {
  console.warn('[Database] MongoDB disconnected. Attempting reconnection...');
});

mongoose.connection.on('error', (err) => {
  console.error(`[Database Error] Runtime connection error: ${err.message}`);
});

module.exports = connectDB;
