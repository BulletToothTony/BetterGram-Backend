const cloudinary = require("../utils/cloudinary");
const upload = require("../middleware/multer");

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
      .populate("userID", "username avatarURL")
      .populate({
        path: "comments._id",
        model: "User",
        select: "username avatarURL", // Populate username in comments
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
      .populate("userID", "username avatarURL")
      .populate({
        path: "comments._id",
        model: "User",
        select: "username avatarURL", // Populate username in comments
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
      .populate("userID", "username avatarURL")
      .populate({
        path: "comments._id",
        model: "User",
        select: "username avatarURL", // Populate username in comments
      });
    console.log(updatedPost, 'updated POST!!!');

    res.status(201).json({ updatedPost });
  } catch (err) {
    console.log(err);
  }
};

const getSinglePost = async (req, res, next) => {
  const { postID } = req.params;

  try {
    const post = await Post.find({ _id: postID })
      .populate("userID", "username avatarURL") // Optionally populate user info
      .populate({
        path: "comments._id",
        model: "User",
        select: "username avatarURL", // Populate username in comments
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

const postStatus = async (req, res, next) => {
  console.log("in post status");
  const { uid } = req.params;
  const { text } = req.body;
  console.log(uid, text);
  console.log(req, '< req');
  console.log(req.file, '< req body');


  console.log(req.body, '< req body');
  console.log(req.body, 'req body')


  const uploadResult = await cloudinary.uploader
    .upload(req.file.path, {
      public_id: "imagepload",
    })
    .catch((error) => {
      console.log(error);
    });



  console.log(uploadResult, "uploaded result");

  

  // update post of logged in user
  try {
    const newPost = new Post({
      userID: uid,
      status: text,
      likes: [],
      comments: [],
      imageURL: uploadResult.secure_url,
    });

    await newPost.save();

    res
      .status(201)
      .json({ message: "Post created successfully!", post: newPost });
  } catch (err) {
    console.log(err);
  }

  // res.status(200).json({text: 'success'})
};

const deletePost = async (req, res, next) => {
  console.log('eeeeeejjjjj')

  const {postID} = req.params

  console.log(postID)

  try {
    const result = await Post.findByIdAndDelete(postID)
    console.log(result)
    res.status(204).json(result)
  } catch (err) {
    console.log(err)
  }

}

exports.postLikePost = postLikePost;
exports.postComment = postComment;
exports.postUnlikePost = postUnlikePost;
exports.getSinglePost = getSinglePost;
exports.postStatus = postStatus;
exports.deletePost = deletePost;