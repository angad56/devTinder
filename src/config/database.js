const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://angadkapoor56:bunnyknows123@cluster0.j5lardt.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
