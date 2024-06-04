import mongoose from 'mongoose';

const uri = "mongodb://localhost:27017/MyFirstDB";

const connectDB = async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Database Connected');
  } catch (error) {
    console.error('Database connection error:', error);
  }
};

export default connectDB;