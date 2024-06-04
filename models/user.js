const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  password: { type: String, required: true, minlength: 6 },
  followers: [{ userID: { type: mongoose.Types.ObjectId } }], //add required true to all below later if needed
  following: [{ userID: { type: mongoose.Types.ObjectId } }],
  // liked photos?
  // images?
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
