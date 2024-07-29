const express = require("express");

const usersControllers = require("../controllers/users-controllers");
const checkAuth = require("../middleware/check-auth");
const upload = require("../middleware/multer");

const router = express.Router();


router.get("/feed/:userId", usersControllers.getFollowingPosts);
router.get("/allusers", usersControllers.getAllUsers);
router.get("/user/:uid", usersControllers.getUserProfile);
router.get("/singleUserFeed/:uid", usersControllers.getSingleUserFeed);

router.post("/signup", upload.single("image"), usersControllers.signup);
router.post("/login", usersControllers.login);

router.use(checkAuth);

router.post("/follow/:uid", usersControllers.postFollowUser);
router.post("/unfollow/:uid", usersControllers.postUnfollowUser);
router.patch(
  "/user/updateUserProfile/:uid",
  upload.single("image"),
  usersControllers.postUserProfileUpdate
);

module.exports = router;
