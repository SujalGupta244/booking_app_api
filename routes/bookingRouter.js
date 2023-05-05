const express = require("express")

const router = express.Router();

const bookingController = require('../controllers/bookingController')

const {bookPlace, getBookingsOfUser} = bookingController


router.route('/')
.get(getBookingsOfUser)
.post(bookPlace)

module.exports = router