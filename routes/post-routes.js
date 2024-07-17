const express = require("express");

const postsControllers = require("../controllers/posts-controllers");

const router = express.Router();
const cloudinary = require("../utils/cloudinary");
const upload = require("../middleware/multer");
const checkAuth = require("../middleware/check-auth");




// router.post('/upload', upload.single('image'), postsControllers.testImageUpload)
router.post("/upload", upload.single("image"), function (req, res) {
  cloudinary.uploader.upload(req.file.path, function (err, result) {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Error",
      });
    }

    res.status(200).json({
      success: true,
      message: "Uploaded!",
      data: result,
    });
  });
});

router.use(checkAuth);

router.post("/post/:uid", upload.single('image'), postsControllers.postStatus); //move this to post routes


router.post("/likePost/:postID", postsControllers.postLikePost);

router.post("/unlikePost/:postID", postsControllers.postUnlikePost);

router.post("/commentPost/:postID", postsControllers.postComment);

router.get("/singlePost/:postID", postsControllers.getSinglePost);

router.delete("/singlePost/:postID", postsControllers.deletePost);


module.exports = router;
