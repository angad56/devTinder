const express = require("express");
const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
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

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const userpresent = await User.findOne({ emailId: emailId });

    if (!userpresent) {
      throw new Error("You don't have an account with us");
    }

    const isValidPassword = userpresent.validatePassword(password);

    if (isValidPassword) {
      //Create a JWT Token

      const token = await userpresent.getJWT();

      //Addt the token to cookie and send the cookie to the User
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 360000000),
      });
      res.send("User Authenticated");
    } else {
      throw new Error("Wrong Password. Try Again");
    }
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("Logout Successful!!");
});

module.exports = authRouter;
