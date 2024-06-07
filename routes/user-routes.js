const express = require('express')

const usersControllers = require('../controllers/users-controllers')

const router = express.Router()

router.get('/feed/:userId', usersControllers.getFollowingPosts)
router.get('/allusers', usersControllers.getAllUsers)
router.post('/follow/:uid', usersControllers.postFollowUser)
router.post('/post/:uid', usersControllers.postStatus)

router.post('/signup', usersControllers.signup)
router.post('/login', usersControllers.login)



module.exports = router;