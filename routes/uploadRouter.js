const express = require("express")

const router = express.Router()

const uploadController = require("../controllers/uploadController")
const {uploadByLink, uploadDirect, removeDirect} = uploadController

const {uploadToLocal} = require('../middleware/photosMiddleware')


router.route('/by-link')
.post(uploadByLink)

router.route('/direct')
// .post(uploadDirect)
.post(uploadToLocal,uploadDirect) // this will upload the incoming images in tmp folder which is inside public folder

router.route('/remove')
.put(removeDirect)

module.exports = router

