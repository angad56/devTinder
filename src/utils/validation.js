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

const validateEditProfileData = (req) => {
  const ALLOWED_FIELDS = [
    "firstName",
    "lastName",
    "emailId",
    "gender",
    "age",
    "photoUrl",
    "about",
    "skills",
  ];

  const isEditAllowed = Object.keys(req.body).every((field) =>
    ALLOWED_FIELDS.includes(field)
  );

  return isEditAllowed;
};

module.exports = { validateSignUpData, validateEditProfileData };
