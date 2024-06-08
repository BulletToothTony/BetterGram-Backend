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
    ).populate('userID', 'username');
    console.log(updatedPost);

    res.status(201).json({updatedPost})

    // let doc = await User.findOneAndUpdate(
    //     {_id: loggedInUser},
    //     {$push: {following: {_id: uid}}},
    //     {new: true}
    // )
  } catch (err) {
    console.log(err)
  }
};

const postComment = async (req, res, next) => {
    const {postID} = req.params;
    const {userID, text} = req.body

    console.log(postID)
    console.log(userID, text)

    try {
        const updatedPost = await Post.findOneAndUpdate(
            { _id: postID },
            { $push: { comments: { _id: userID, text: text } } },
            { new: true }
          ).populate('userID', 'username');
          console.log(updatedPost);
    } catch(err) {
        console.log(err)
    }
}

exports.postLikePost = postLikePost;
exports.postComment = postComment;
