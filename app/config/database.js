import mongoose from "mongoose";

let connected = false;

const connectDB = async () => {
  mongoose.set("strictQuery", true);

  // If the db is already connected dont connect again
  if (connected) {
    console.log("MongoDb is connected");
    return;
  }

  // Connect to MongoDB
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    connected = true;
  } catch (e) {
    console.log(e);
  }
};

export default connectDB;
