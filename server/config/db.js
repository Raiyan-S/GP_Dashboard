import mongoose from 'mongoose';

export const connectDB = async () => {
  // Skip MongoDB connection if URI is not provided
  if (!process.env.MONGODB_URI) {
    console.log('MongoDB URI not provided - using temporary data');
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      retryWrites: true,
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    mongoose.connection.on('error', err => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      process.exit(0);
    });

  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    // Don't exit process, fall back to temporary data
    console.log('Falling back to temporary data');
  }
};