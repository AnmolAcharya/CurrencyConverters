import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${connection.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    // Don't exit the process immediately in production
    // Instead, you might want to retry the connection
    setTimeout(() => {
      console.log("Retrying MongoDB connection...");
      connectDB();
    }, 5000);
  }
};

export default connectDB;