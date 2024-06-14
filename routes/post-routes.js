const express = require('express')

const postsControllers = require('../controllers/posts-controllers')

const router = express.Router()


router.post("/likePost/:postID", postsControllers.postLikePost)
router.post("/unlikePost/:postID", postsControllers.postUnlikePost)

router.post("/commentPost/:postID", postsControllers.postComment)

router.get("/singlePost/:postID", postsControllers.getSinglePost)

module.exports = router;