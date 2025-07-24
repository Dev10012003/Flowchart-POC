import mongoose from "mongoose";

const connectToDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGODB_URL!);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export default connectToDatabase;
