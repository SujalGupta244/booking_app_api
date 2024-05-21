const express = require("express")

const router = express.Router()

const placesController = require('../controllers/paypalController')
const { generateAccessToken } = require("../middleware/generateAccessToken")
const {createOrder, captureOrder} = placesController


router.route('/createOrder')
.post(generateAccessToken, createOrder)


router.route('/captureOrder')
.post(generateAccessToken, captureOrder)


module.exports = router