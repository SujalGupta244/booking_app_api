const express = require("express")

const router = express.Router()

const placesController = require('../controllers/placesController')
const {getAllPlaces, getUserPlaces, addPlaces, getPlacebyId, updatePlace} = placesController


router.route('/')
.get(getAllPlaces)

router.route('/user')
.get(getUserPlaces)
.post(addPlaces)


router.route('/:id')
.get(getPlacebyId)
.put(updatePlace)


module.exports = router