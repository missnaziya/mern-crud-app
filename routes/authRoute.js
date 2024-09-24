const authController = require('./../controllers/authController')
const auth = require('./../middleware/auth')
const express = require('express')

const router = express.Router();

router.post('/sign-up', authController.signUp)
router.post('/log-in', authController.login)
router.get('/me',auth, authController.me)


module.exports = router