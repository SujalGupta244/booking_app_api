const express = require("express")

const router = express.Router()

// const uploadController = require("../controllers/uploadController")
const uploadCloudinaryController = require("../controllers/uploadCloudinaryController")
// const {uploadByLink, uploadDirect, removeDirect} = uploadController
const {uploadByLink, uploadDirect, removeDirect} = uploadCloudinaryController

// const {uploadToLocal} = require('../middleware/photosMiddleware')
const {uploadToLocal} = require('../middleware/photosMiddlewareCloudinary')


router.route('/by-link')
.post(uploadByLink)

router.route('/direct')
// .post(uploadDirect)
.post(uploadToLocal,uploadDirect) // this will upload the incoming images in tmp folder first and then on S3 bucket which is inside public folder

router.route('/remove')
.put(removeDirect)

module.exports = router

