const mongoose = require("mongoose");
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/Ikonic-Chat");
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};
module.exports = connectDB;
