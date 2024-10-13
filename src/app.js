const express = require("express");
const connectDB = require("./config/database");
const User = require("../src/models/user");
const { validateSignUpData } = require("../src/utils/validation");
const bcrypt = require("bcrypt");

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  const userObj = req.body;
  const { firstName, lastName, emailId, password } = req.body;

  try {
    //Validation of the Data

    validateSignUpData(userObj);

    //Encrypt the Password
    const hashedpass = await bcrypt.hash(password, 10);
    // console.log(hashedpass);

    //   const userObj = {
    //     firstName: "Khushi",
    //     lastName: "Nagriya",
    //     emailId: "khushi@gmail.com",
    //     password: "12345",
    //   };

    // creating new Instance of the User Model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashedpass,
    });

    await user.save();

    res.status(401).send("User added successfully");
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const userpresent = await User.findOne({ emailId: emailId });

    if (!userpresent) {
      throw new Error("You don't have an account with us");
    }

    const isValidPassword = await bcrypt.compare(
      password,
      userpresent.password
    );

    if (isValidPassword) {
      res.send("User Authenticated");
    } else {
      throw new Error("Wrong Password. Try Again");
    }
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
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

app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    const ALLOWED_FIELDS = ["photoUrl", "about", "gender", "age", "skills"];

    const isupdateAllowed = Object.keys(data).every((key) =>
      ALLOWED_FIELDS.includes(key)
    );

    if (!isupdateAllowed) {
      throw new Error("Updating this field is not allowed");
    }

    if (data?.skills.length > 10) {
      throw new Error("Skills can only be upto 10");
    }

    const user = await User.findOneAndUpdate({ _id: userId }, data, {
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
