const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  password: { type: String, required: true, minlength: 6 },
  followers: [{ userID: { type: mongoose.Types.ObjectId, ref: 'User' } }],
  following: [{ userID: { type: mongoose.Types.ObjectId, ref: 'User' } }],
  avatarURL: {type: String},
  bio: {type: String},
  posts: [ {status: {type: String}, likes: [{userID: { type: mongoose.Types.ObjectId }}], comments: [{userID: { type: mongoose.Types.ObjectId }}, {text: {type: String}}]}]
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
