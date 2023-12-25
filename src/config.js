const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const MONGO_URL = process.env.MONGO_URL;

async function connectToDatabase() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Database connection established");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
}

connectToDatabase();

// login schema
const loginSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },
});

//user collection
const userCollection = new mongoose.model("users", loginSchema);

//feedback schema
const feedbackSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  message: { type: String, required: true },
});

const feedbackCollection = new mongoose.model("feedbacks", feedbackSchema);

module.exports = {userCollection, feedbackCollection};
