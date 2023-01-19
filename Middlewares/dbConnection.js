import mongoose from "mongoose";

const connectdb = async () => {
  console.log(process.env.LIVE_DB, "DB Url");
  try {
    await mongoose.connect(process.env.LIVE_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("db connected sucessfully");
  } catch (error) {
    console.log(error);
  }
};

export default connectdb;
