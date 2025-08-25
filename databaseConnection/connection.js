import mongoose from "mongoose";

// database connection
export const connectToDatabase = async() => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("database connected successfully");
  } catch (error) {
    console.log(error);
  }
};
connectToDatabase();
