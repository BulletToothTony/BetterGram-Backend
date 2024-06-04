const User = require("../models/user")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const postSingleUser = async (req, res, next) => {
    const createdUser = new User({
        email: "h@x.com",
        username: "henrywl",
        password: "123456789",
        followers: [],
        following: []
    })

    try {
        await createdUser.save()
    } catch(err) {
        console.log(err)
    }


    res.status(201).json({createdUser})
}

const signup = async (req, res, next) => {
    const { email, username, password } = req.body;
  
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
      following: []
    });
  
    try {
      await createdUser.save();
    } catch (err) {
      console.log(err);
    }
  
    //generate token
    // let token;
    // try {
    //   token = jwt.sign(
    //     {
    //       userId: createdUser._id,
    //       username: createdUser.username,
    //       email: createdUser.email,
    //     },
    //     process.env.JWT_KEY
    //   );
    // } catch (err) {
    //   console.log(err);
    // }
  
    res.status(201).json({ createdUser });
  };


exports.postSingleUser = postSingleUser;