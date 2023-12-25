const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const { userCollection, feedbackCollection } = require("./config");

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//ejs view engine
app.set("view engine", "ejs");

//static files
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/home.html"));
});

app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/signup", (req, res) => {
  res.render("signup");
});

app.get("/feedback", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/feedback.html"));
});

// Register user
app.post("/signup", async (req, res) => {
  const data = {
    name: req.body.username,
    password: req.body.password,
  };

  // Check if user already exists
  const existingUser = await userCollection.findOne({ name: data.name });
  if (existingUser) {
    res.send("User already exists. Please choose a different username");
  } else {
    // Hash password
    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(data.password, saltRounds);

    data.password = hashPassword; // Replace password
    await userCollection.insertMany(data);
    res.sendFile(path.join(__dirname, "../views/home.html"));
  }
});

// Login
app.post("/login", async (req, res) => {
  try {
    const check = await userCollection.findOne({ name: req.body.username });
    if (!check) {
      res.send("User not found");
    }

    const isPasswordMatch = await bcrypt.compare(
      req.body.password,
      check.password
    );
    if (isPasswordMatch) {
      res.sendFile(path.join(__dirname, "../views/home.html"));
    } else {
      res.send("Wrong password");
    }
  } catch {
    res.send("Wrong details");
  }
});

app.post("/feedback", async (req, res) => {
  const data = {
    name: req.body.name,
    email: req.body.email,
    message: req.body.message,
  };
  console.log(data);
  await feedbackCollection.insertMany(data);

  res.sendFile(path.join(__dirname, "../views/feedback.html"));
});

app.listen(PORT, () => {
  console.log("Listening on port " + PORT);
});
