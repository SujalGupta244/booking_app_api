const express = require("express")
const router = express.Router()

const userController = require("../controllers/usersController")
const {getAllUsers} = userController

router.route('/')
.get(getAllUsers)

module.exports = router