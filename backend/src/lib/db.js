// db.js
import mongoose from 'mongoose';

const connectDB = async () => {
  const MONGO_URI = process.env.MONGO_URI;

  if (!MONGO_URI) {
    throw new Error('MONGO_URI is not defined');
  }

  try {
    await mongoose.connect(MONGO_URI);

    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  }

  // Close the connection when the app exits
  process.on('SIGINT', () => {
    mongoose.connection.close(() => {
      console.log('Disconnected from MongoDB');
      process.exit(0);
    });
  });
};

export default connectDB;