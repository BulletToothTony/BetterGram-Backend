const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

const signup = async (req, res, next) => {
  console.log("in signup");
  console.log(req.body);
  const { email, username, password } = req.body;

  console.log(email, username, password);

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
    password: hashedPass,
    followers: [],
    following: [],
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
          email: existingUser.email,
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
      token,
    });
  };

exports.postSingleUser = postSingleUser;
exports.getAllUsers = getAllUsers;
exports.signup = signup;
exports.login = login;