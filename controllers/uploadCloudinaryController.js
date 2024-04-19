const Place = require("../models/Place")
const asyncHandler = require('express-async-handler')

const imageDownloader = require("image-downloader")
const path = require("path")
const fs = require("fs")
const mime = require("mime-types")
const {uploadToCloudinary, deleteFromCloudinary} = require("../middleware/photosMiddlewareCloudinary")

const uploadByLink = asyncHandler(async (req, res) =>{
    const {link} = req.body
    const newName = Date.now() + '.jpg'
    const newPath = path.join(__dirname, '..', "public", 'tmp', newName)
     await imageDownloader.image({
        url: link,
        dest: newPath
    })
    const url = await uploadToCloudinary(newPath)
    res.json(url)
})


const uploadDirect = asyncHandler(async (req, res) =>{
    const files = req.files
    // console.log(req.files)
    if(!files || !files.length){
        res.status(400).json({message:'files are missing'})
    }

    const uploadedFiles = [];
    // console.log(files)
    for(let i = 0;i<req.files.length;i++){
        const fileInfo = req.files[i]
        const {path} = fileInfo
        const url = await uploadToCloudinary(path)
        // console.log(url)
        uploadedFiles.push(url) 
    }

    res.json(uploadedFiles)
})

const removeDirect = asyncHandler(async(req, res) =>{
    const {id, name} = req.body
    if(!id || !name ){
        res.status(400).json({message: 'file not found'})
    }

    const place = await Place.findById(id).exec()
    if(!place){
        res.status(400).json({message: "place not found"})
    }

    const filterImages = place.images.filter(image => image.public_id != name.public_id)

    // Remove image link from mongodb
    place.images = filterImages
    await place.save()
    
    // Remvoe image from cloudinary
    const removeImage = await deleteFromCloudinary(name)
    // console.log(removeImage);
    // console.log((req.body));
    
    res.json({message: "photo deleted successfully"})
})


module.exports = {uploadByLink, uploadDirect, removeDirect}

