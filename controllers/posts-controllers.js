const Post = require("../models/post");

const postLikePost = async (req, res, next) => {
  console.log("like post");
  const { postID } = req.params;
  const { userID } = req.body;
  console.log(postID, "postID");
  console.log(userID, "userID");

  try {
    const updatedPost = await Post.findOneAndUpdate(
      { _id: postID },
      { $push: { likes: { _id: userID } } },
      { new: true }
    )
      .populate("userID", "username")
      .populate({
        path: "comments._id",
        model: "User",
        select: "username", // Populate username in comments
      });
    console.log(updatedPost);

    res.status(201).json({ updatedPost });

    // let doc = await User.findOneAndUpdate(
    //     {_id: loggedInUser},
    //     {$push: {following: {_id: uid}}},
    //     {new: true}
    // )
  } catch (err) {
    console.log(err);
  }
};

const postUnlikePost = async (req, res, next) => {
  const { postID } = req.params;
  const { userID } = req.body;

  try {
    const updatedPost = await Post.findOneAndUpdate(
      { _id: postID },
      { $pull: { likes: { _id: userID } } },
      { new: true }
    )
      .populate("userID", "username")
      .populate({
        path: "comments._id",
        model: "User",
        select: "username", // Populate username in comments
      });
    console.log(updatedPost);

    res.status(201).json({ updatedPost });

    // let doc = await User.findOneAndUpdate(
    //     {_id: loggedInUser},
    //     {$push: {following: {_id: uid}}},
    //     {new: true}
    // )
  } catch (err) {
    console.log(err);
  }
};

const postComment = async (req, res, next) => {
  const { postID } = req.params;
  const { userID, text } = req.body;

  console.log(postID);
  console.log(userID, text);

  try {
    const updatedPost = await Post.findOneAndUpdate(
      { _id: postID },
      { $push: { comments: { _id: userID, text: text } } },
      { new: true }
    )
      .populate("userID", "username")
      .populate({
        path: "comments._id",
        model: "User",
        select: "username", // Populate username in comments
      });
    console.log(updatedPost);

    res.status(201).json({ updatedPost });
  } catch (err) {
    console.log(err);
  }
};

const getSinglePost = async (req, res, next) => {
  const { postID } = req.params;

  try {
    const post = await Post.find({ _id: postID })
      .populate("userID", "username") // Optionally populate user info
      .populate({
        path: "comments._id",
        model: "User",
        select: "username", // Populate username in comments
      }); // Populate user info for comments
    // .sort({ createdAt: -1 }); // Sort by creation date, newest first

    console.log(post);
    res.status(200).json({ post });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Fetching post failed, please try again later." });
  }
};

exports.postLikePost = postLikePost;
exports.postComment = postComment;
exports.postUnlikePost = postUnlikePost;
exports.getSinglePost = getSinglePost;
