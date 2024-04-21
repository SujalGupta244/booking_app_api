const express = require("express")

const router = express.Router();

const bookingController = require('../controllers/bookingController')

const {bookPlace, getBookingsOfUser, deleteBookingOfUser} = bookingController


router.route('/')
.get(getBookingsOfUser)
.post(bookPlace)

router.route('/delete')
.post(deleteBookingOfUser)

module.exports = router