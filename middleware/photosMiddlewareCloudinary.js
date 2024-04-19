const multer = require("multer")
const path = require("path")

const cloudinary = require("cloudinary").v2

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
})

const uploadToLocal = multer({dest: path.join(__dirname, '..', "public", 'tmp')}).array('photos',100)


const uploadToCloudinary = async(path) =>{

    const response = await cloudinary.uploader.upload(path, {folder: 'booking_app_photos'}, (err, result) =>{
        if(err){
            console.log(err)
            return err
        }
        return result
    })
    const obj = {url: response.secure_url, public_id : response.public_id}
    // console.log(response)
    return obj

}

// Middleware to delete images from s3 bucket
const deleteFromCloudinary = async(file) =>{
    // console.log(file)
    const response = await cloudinary.uploader.destroy(`${file.public_id}` ,
    (error,result)=>{
        return result
    })
    // console.log(response)
    return response
}

module.exports = {uploadToLocal, uploadToCloudinary, deleteFromCloudinary}

