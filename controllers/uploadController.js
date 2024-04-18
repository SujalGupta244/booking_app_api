const Place = require("../models/Place")
const asyncHandler = require('express-async-handler')

const imageDownloader = require("image-downloader")
const path = require("path")
const fs = require("fs")
const mime = require("mime-types")
const {uploadToS3, deleteFromS3} = require("../middleware/photosMiddleware")

const uploadByLink = asyncHandler(async (req, res) =>{
    const {link} = req.body
    const newName = Date.now() + '.jpg'
    const newPath = path.join(__dirname, '..', "public", 'tmp', newName)
     await imageDownloader.image({
        url: link,
        dest: newPath
    })
    const url = await uploadToS3(newPath, newName, mime.lookup(newPath))
    res.json(url)
})


const uploadDirect = asyncHandler(async (req, res) =>{
    const files = req.files
    // console.log(req.files)
    if(!files || !files.length){
        res.status(400).json({message:'files are missing'})
    }

    const uploadedFiles = [];
    console.log(files)
    for(let i = 0;i<req.files.length;i++){
        const fileInfo = req.files[i]
        const {path, originalname, mimetype} = fileInfo
        const url = await uploadToS3(path,originalname, mimetype)
        uploadedFiles.push(url) 
        // const parts = originalname.split('.')
        // const ext = parts[parts.length-1]
        // const newPath = `${path}.${ext}` 
        // fs.renameSync(path, newPath)
        // // console.log(path.split("\\"));
        // uploadedFiles.push(newPath.split("\\")[newPath.split("\\").length - 1])
    }

    res.json(uploadedFiles)
})

const removeDirect = asyncHandler(async(req, res) =>{
    const {id, name} = req.body
    // if(!id || !name || !fs.existsSync(path.join(__dirname,"..", "public","uploads", name))){
    if(!id || !name ){
        res.status(400).json({message: 'file not found'})
    }

    const place = await Place.findById(id).exec()
    if(!place){
        res.status(400).json({message: "place not found"})
    }

    const filterImages = place.images.filter(image => image != name)

    // Remove image link from mongodb
    place.images = filterImages
    await place.save()
    
    // Remvoe image from S3 bucket
    const removeImage = await deleteFromS3(name)
    // console.log(removeImage);
    // console.log((req.body));
    
    res.json({message: "photo deleted successfully"})
})


// console.log(path.join(__dirname, "public","uploads", filename));
// fsPromise.appendFile(path.join(__dirname,'..' , 'uploads','in.html'),'html file')
// .then(res => console.log(res))
// .catch(rej => console.log(rej))


module.exports = {uploadByLink, uploadDirect, removeDirect}

