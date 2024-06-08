const express = require('express')

const postsControllers = require('../controllers/posts-controllers')

const router = express.Router()


router.post("/likePost/:postID", postsControllers.postLikePost)
router.post("/commentPost/:postID", postsControllers.postComment)

module.exports = router;