import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const DBconnection = async () => {
  try {
    const connectionString = process.env.MangoDB_URL;
    console.log("🔌 Connecting to:", connectionString,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    );
    await mongoose.connect(connectionString);
    console.log('✅ MongoDB connected successfully!');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
  }
};
