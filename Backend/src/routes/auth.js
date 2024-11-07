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

    // creating new Instance of the User Model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashedpass,
    });

    const savedUser = await user.save();
    const token = await savedUser.getJWT();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 360000000),
      httpOnly: true, // Prevents JavaScript access to cookie for security
      secure: true, // Ensures the cookie is sent only over HTTPS
      sameSite: "None", // Allows cookies to be sent across different domains
    });

    res
      .status(200)
      .json({ message: "User added successfully", data: savedUser });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const userpresent = await User.findOne({ emailId: emailId });

    if (!userpresent) {
      throw new Error("Invalid Credentials");
    }

    const isValidPassword = userpresent.validatePassword(password);

    if (isValidPassword) {
      //Create a JWT Token

      const token = await userpresent.getJWT();

      //Addt the token to cookie and send the cookie to the User
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 360000000),
        httpOnly: true, // Prevents JavaScript access to cookie for security
        secure: true, // Ensures the cookie is sent only over HTTPS
        sameSite: "None", // Allows cookies to be sent across different domains
      });

      res.send(userpresent);
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
