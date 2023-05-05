const express = require("express")
const router = express.Router()

const authControllers = require("../controllers/authController")

const {register, login, refresh, logout} = authControllers


router.route('/login')
    .post(login)

router.route('/register')
    .post(register)

router.route('/refresh')
    .get(refresh)

router.route('/logout')
    .get(logout)

module.exports = router


