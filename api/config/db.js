import mongoose from 'mongoose';

export const connectDB = async () => { 
   try {
     const conn = await mongoose.connect(process.env.MONGODB_URL);
     console.log(`MongoDB Connected: ${conn.connection.host}`);
   } catch (e) {
     console.error(`Error: ${e.message}`);
     process.exit(1); // Exit process with failure
   }
};
