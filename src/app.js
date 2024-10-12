const express = require("express");
const connectDB = require("./config/database");
const User = require("../src/models/user");

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  const userObj = req.body;

  //   const userObj = {
  //     firstName: "Khushi",
  //     lastName: "Nagriya",
  //     emailId: "khushi@gmail.com",
  //     password: "12345",
  //   };

  try {
    // creating new Instance of the User Model
    const user = new User(userObj);
    await user.save();

    res.status(401).send("User added successfully");
  } catch (err) {
    res.status(400).send("Error saving the user:" + err.message);
  }
});

app.get("/user", async (req, res) => {
  const user = await User.find({ emailId: req.body.emailId });

  try {
    if (user) {
      res.send(user);
    } else {
      res.send("User not found");
    }
  } catch (err) {
    res.send("Something went wrong!");
  }
});

app.get("/feed", async (req, res) => {
  const users = await User.find({});

  try {
    if (users) {
      res.send(users);
    } else {
      res.send("User not found");
    }
  } catch (err) {
    res.send("Something went wrong!");
  }
});

app.delete("/user", async (req, res) => {
  const userid = req.body.emailId;
  console.log(userid);
  try {
    await User.findByIdAndDelete({ emailId: userid });
    res.send(userid + "is deleted");
  } catch (err) {
    res.send("Something went wrong!");
  }
});

app.patch("/user", async (req, res) => {
  const data = req.body;
  const userId = req.body.emailId;

  try {
    const user = await User.findOneAndUpdate({ emailId: userId }, data, {
      runValidators: true,
    });
    res.send("User updated successfully");
  } catch (err) {
    res.status(400).send("Update Failed " + err.message);
  }
});

connectDB()
  .then(() => {
    console.log("database connection established");
    app.listen(7777, () => console.log("App Listening on Port 7777"));
  })
  .catch((err) => console.log(err.message));
