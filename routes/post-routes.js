const express = require("express");

const postsControllers = require("../controllers/posts-controllers");

const router = express.Router();
const cloudinary = require("../utils/cloudinary");
const upload = require("../middleware/multer");
const checkAuth = require("../middleware/check-auth");

router.use(checkAuth);

router.post("/post/:uid", upload.single("image"), postsControllers.postStatus); //move this to post routes

router.post("/likePost/:postID", postsControllers.postLikePost);

router.post("/unlikePost/:postID", postsControllers.postUnlikePost);

router.post("/commentPost/:postID", postsControllers.postComment);

router.get("/singlePost/:postID", postsControllers.getSinglePost);

router.delete("/singlePost/:postID", postsControllers.deletePost);

module.exports = router;
