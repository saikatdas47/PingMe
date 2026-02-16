import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    const databaseName = "/PingMeChatApp"
    const DBUrl=uri+databaseName


    if (!uri) {
      throw new Error("MONGODB_URI is missing in .env");
    }

    await mongoose.connect(DBUrl).then(console.log("DB Connected"));
  } catch (e) {
    console.log("Error in connect to MongoDb:", e.message);
  }
};