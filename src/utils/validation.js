const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req;

  if (firstName?.length < 4 || firstName?.length > 50) {
    throw new Error(
      "Your Name must be more than 4 chars and less than 50 chars"
    );
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Enter a Valid Email Address");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please Enter a Strong Password");
  }
};

module.exports = { validateSignUpData };
