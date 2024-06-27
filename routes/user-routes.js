const express = require('express')

const usersControllers = require('../controllers/users-controllers')
const upload = require('../middleware/multer')

const router = express.Router()

router.get('/feed/:userId', usersControllers.getFollowingPosts)
router.get('/allusers', usersControllers.getAllUsers)
router.post('/follow/:uid', usersControllers.postFollowUser)
router.post('/unfollow/:uid', usersControllers.postUnfollowUser)



router.get('/user/:uid', usersControllers.getUserProfile)
router.get('/singleUserFeed/:uid', usersControllers.getSingleUserFeed)

router.patch('/user/updateUserProfile/:uid', upload.single('image'), usersControllers.postUserProfileUpdate)

router.post('/signup', upload.single('image'), usersControllers.signup)
router.post('/login', usersControllers.login)



module.exports = router;