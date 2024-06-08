const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const postSchema = new Schema({
  userID: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, required: true },
  likes: [{ userID: { type: mongoose.Types.ObjectId, ref: 'User' } }],
  comments: [
    {
      userID: { type: mongoose.Types.ObjectId, ref: 'User' },
      text: { type: String, required: true },
      time: {type: Date, default: Date.now}
    }
  ],
}, { timestamps: true });

module.exports = mongoose.model("Post", postSchema);
