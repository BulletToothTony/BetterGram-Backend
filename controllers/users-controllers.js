const User = require("../models/user");
const Post = require("../models/post");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose")
const cloudinary = require("../utils/cloudinary");


const postSingleUser = async (req, res, next) => {
  const createdUser = new User({
    email: "h@x.com",
    username: "henrywl",
    password: "123456789",
    followers: [],
    following: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    console.log(err);
  }

  res.status(201).json({ createdUser });
};

const getAllUsers = async (req, res, next) => {
    let allUsers
    try {

        allUsers = await User.find({})
    } catch(err) {
        console.log(err)
    }

    res.status(200).json({allUsers})

}

const postFollowUser = async (req, res, next) => {
    console.log('running follow')
    
    const {uid} = req.params
    const {loggedInUser} = req.body

    console.log(req.params)
    console.log(loggedInUser, 'loggedInUser')



    console.log(req.body, 'req body')


    // update user to be followed
    try {
        let doc = await User.findOneAndUpdate(
            {_id: uid},
            {$push: {followers: {_id: loggedInUser}}},
            {new: true}
        )

        res.status(200).json({doc})
    } catch(err) {
        console.log(err)
    }

    // updated logged in user following
    try {
        let doc = await User.findOneAndUpdate(
            {_id: loggedInUser},
            {$push: {following: {_id: uid}}},
            {new: true}
        )

        res.status(200).json({doc})
    } catch(err) {
        console.log(err)
    }

    // let doc = await User.findOneAndUpdate({_id: uid}, {followers: [loggedInUser]}, {new: true})

    // res.status(200).json({doc})
    // let userToBeFollowed;
    // try {
    //     userToBeFollowed = await User.find({_id: uid})
    //     userToBeFollowed.following.push(loggedInUser)
    //     userToBeFollowed.save()
    // } catch(err) {
    //     console.log(err)
    // }

    // console.log(userToBeFollowed)

    // res.status(200).json({text:'running'})
}

const postUnfollowUser = async (req, res, next) => {
    console.log('running unfollow')
    
    const {uid} = req.params
    const {loggedInUser} = req.body

    console.log(req.params)
    console.log(loggedInUser, 'loggedInUser')



    console.log(req.body, 'req body')


    // update user to be unfollowed
    try {
        let doc = await User.findOneAndUpdate(
            {_id: uid},
            {$pull: {followers: {_id: loggedInUser}}},
            {new: true}
        )

        res.status(200).json({doc})
    } catch(err) {
        console.log(err)
    }

    // updated logged in user following
    try {
        let doc = await User.findOneAndUpdate(
            {_id: loggedInUser},
            {$pull: {following: {_id: uid}}},
            {new: true}
        )

        res.status(200).json({doc})
    } catch(err) {
        console.log(err)
    }

    // let doc = await User.findOneAndUpdate({_id: uid}, {followers: [loggedInUser]}, {new: true})

    // res.status(200).json({doc})
    // let userToBeFollowed;
    // try {
    //     userToBeFollowed = await User.find({_id: uid})
    //     userToBeFollowed.following.push(loggedInUser)
    //     userToBeFollowed.save()
    // } catch(err) {
    //     console.log(err)
    // }

    // console.log(userToBeFollowed)

    // res.status(200).json({text:'running'})
}

const postStatus = async (req, res, next) => {
    console.log('in post status')
    const {uid} = req.params
    const {text} = req.body
    console.log(uid, text)

    // update post of logged in user
    try {
        // let doc = await User.findOneAndUpdate(
        //     {_id: uid},
        //     {$push: {posts: {status: text}}},
        //     {new: true}
        // )

        const newPost = new Post({
            userID: uid,
            status: text,
            likes: [],
            comments: []
        })

        await newPost.save()



        res.status(201).json({message: 'Post created successfully!', post: newPost})
    } catch(err) {
        console.log(err)
    }


    // res.status(200).json({text: 'success'})
}

const getFollowingPosts = async(req, res, next) => {
    console.log('first')

    const {userId} = req.params

    console.log(userId, 'useriddddd')

    try {
        // Find the current user and populate the following list
        const user = await User.findById({_id: userId}).populate('following.userID');

        console.log(user, 'user')
        
        // Extract following user IDs
        const followingUserIds = user.following.map(f => f._id);

        // include current user's ID to show their posts in feed
        // followingUserIds.push(mongoose.Types.ObjectId('12344'))
        // const newUserID = mongoose.Types.ObjectId(userId)
        // console.log(newUserID)

        followingUserIds.push(userId)
        console.log(followingUserIds, '<<<<<<<<<<<< following ids')
        
        // Find posts from the users the current user is following
        const posts = await Post.find({ userID: { $in: followingUserIds } })
                                .populate('userID', 'username avatarURL') // Optionally populate user info
                                .populate({
                                    path: 'comments._id',
                                    model: 'User',
                                    select: 'username' // Populate username in comments
                                  }) // Populate user info for comments
                                .sort({ createdAt: -1 }); // Sort by creation date, newest first
    

        console.log(posts)

        res.status(200).json({ posts });
      } catch (err) {
        res.status(500).json({ message: 'Fetching posts failed, please try again later.' });
      }




    // try {
    //     let doc = await User.find({_id: uid})

    //     res.status(200).json({userFollowing: doc[0].following})
    // } catch(err) {
    //     console.log(err)
    // }
    // get user id of logged in user
    // get following IDs
    // populate with posts
    // get posts from following IDs
}

const getSingleUserFeed = async (req, res, next) => {
    // get single feed for user when on their profile
    console.log('single user feed')
    const {uid} = req.params

    console.log(uid, 'useriddddd')

    try {
        // Find the current user and populate the following list
        const user = await User.findById({_id: uid}).populate('following.userID');

        console.log(user, 'user')
        
        // get post from user from their own ID
        const followingUserIds = [uid]

        // include current user's ID to show their posts in feed
        // followingUserIds.push(mongoose.Types.ObjectId('12344'))
        // const newUserID = mongoose.Types.ObjectId(userId)
        // console.log(newUserID)

        // followingUserIds.push(userId)
        console.log(followingUserIds, '<<<<<<<<<<<< following ids')
        
        // Find posts from the users the current user is following
        const posts = await Post.find({ userID: { $in: followingUserIds } })
                                .populate('userID', 'username avatarURL') // Optionally populate user info
                                // .populate('user', 'avatarURL')
                                .populate({
                                    path: 'comments._id',
                                    model: 'User',
                                    select: 'username' // Populate username in comments
                                  }) // Populate user info for comments
                                .sort({ createdAt: -1 }); // Sort by creation date, newest first
    

        console.log(posts)

        res.status(200).json({ posts });
      } catch (err) {
        res.status(500).json({ message: 'Fetching posts failed, please try again later.' });
      }
}


// user profile

const getUserProfile = async(req, res, next) => {
    console.log('user profile')

    const {uid} = req.params;

    try {
        const foundUser = await User.findOne({ _id: uid });

        if (!foundUser) {
            return res.status(404).json({message: "User not found"})
        }

        const postCount = await Post.countDocuments({userID: uid})

        res.status(200).json({foundUser, postCount})

    } catch(err) {

    }
}

const postUserProfileUpdate = async (req, res, next) => {
    console.log('in user profile update controller')
    const {uid} = req.params

    console.log(uid)

    const { username, email, password, bio } = req.body;
  console.log(uid);
  console.log(req.body, '< req body');


  let uploadResult;
if (req.body.image !== 'undefined') {
  uploadResult = await cloudinary.uploader
    .upload(req.file.path, {
      public_id: "imagepload",
    })
    .catch((error) => {
      console.log(error);
    });

}

console.log(req.file, 'req.file')


  console.log(uploadResult, "uploaded result");

  const updateFields = {};
  if (username !== '') updateFields.username = username;
  if (email !== '') updateFields.email = email;
  if (bio !== '') updateFields.bio = bio;
  if (req.file !== undefined) updateFields.avatarURL = uploadResult.secure_url
//   if (avatarURL !== '') updateFields.avatarURL = avatarURL
  if (password !== '') {
  try {
    const hashedPass = await bcrypt.hash(password, 12);
    updateFields.password = hashedPass
  } catch (err) {
    console.log(err, "error hashing pass");
  }

  }

  let updatedUser
  try {
    if (Object.keys(updateFields).length > 0) {
      updatedUser = await User.findByIdAndUpdate(uid, updateFields, {new: true});
    } else {
      return res.status(400).json({ message: 'No valid fields to update' });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Updating user failed, please try again' });

  }

  console.log(updatedUser, 'updateduser');

  return res.json({ updatedUser });
  // const user = usersList.filter((user) => user.id === uid);

  // if (user.length !== 0) {
  //   user[0].name = name;
  // } else {
  //   return res.status(404).json({ error: "ID not found!" });
  // }
}


const signup = async (req, res, next) => {
  console.log("in signup");
  console.log(req.body);
  const { email, username, password } = req.body;

  console.log(email, username, password);

  const uploadResult = await cloudinary.uploader
  .upload(req.file.path, {
    public_id: `imagepload`,
  })
  .catch((error) => {
    console.log(error);
  });



console.log(uploadResult, "uploaded result");

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
    console.log(existingUser, "existing user");
  } catch (err) {
    console.log(err, "error signing up");
  }

  if (existingUser) {
    throw new Error("User already exists");
  }

  const saltRounds = 12;
  let hashedPass;
  try {
    hashedPass = await bcrypt.hash(password, saltRounds);
  } catch (err) {
    console.log(err, "error hashing pass");
  }

  const createdUser = new User({
    email,
    username,
    bio: "",
    password: hashedPass,
    followers: [],
    following: [],
    avatarURL: uploadResult.secure_url
  });

  try {
    await createdUser.save();
  } catch (err) {
    console.log(err);
  }

//   generate token
  let token;
  try {
    token = jwt.sign(
      {
        userId: createdUser._id,
        username: createdUser.username,
        email: createdUser.email,
      },
      process.env.JWT_KEY
    );
  } catch (err) {
    console.log(err);
  }

  res.status(201).json({ createdUser, token });
};

// login
const login = async (req, res, next) => {
    const { email, password } = req.body;
  
    let existingUser;
    try {
      existingUser = await User.findOne({ email: email });
      console.log(existingUser, "existing user");
    } catch (err) {
      console.log(err);
    }
  
    if (!existingUser) {
      console.log("user not found, please register");
    }
  
    let isValidPassword = false;
    try {
      isValidPassword = await bcrypt.compare(password, existingUser.password);
    } catch (err) {
      console.log(err);
    }
    console.log(isValidPassword, "< correctPass");
  
    if (!isValidPassword) {
      throw new Error("Invalid Password");
    }
  
    let token;
    try {
      token = jwt.sign(
        {
          userId: existingUser._id,
          username: existingUser.username,
          email: existingUser.email
        },
        process.env.JWT_KEY
      );
    } catch (err) {
      console.log(err);
    }
  
    res.json({
      email: existingUser.email,
      username: existingUser.username,
      _id: existingUser._id,
      userAvatarURL: existingUser.avatarURL,
      token,
    });
  };

exports.postSingleUser = postSingleUser;
exports.getAllUsers = getAllUsers;
exports.signup = signup;
exports.login = login;
exports.postFollowUser = postFollowUser;
exports.postUnfollowUser = postUnfollowUser;
// exports.postStatus = postStatus;
exports.getFollowingPosts = getFollowingPosts;
exports.getUserProfile = getUserProfile;
exports.getSingleUserFeed = getSingleUserFeed;
exports.postUserProfileUpdate = postUserProfileUpdate;