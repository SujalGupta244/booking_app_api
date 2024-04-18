const multer = require("multer")
// const {S3Client, PutObjectCommand, DeleteObjectCommand} = require("@aws-sdk/client-s3")
const path = require("path")
const fs = require("fs")
// const bucket = 'sujal-booking-app'

const cloudinary = require("cloudinary").v2

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
})



// const photosMiddleware = multer({dest: path.join(__dirname, '..', "public", 'uploads')}).array('photos',100)
const uploadToLocal = multer({dest: path.join(__dirname, '..', "public", 'tmp')}).array('photos',100)


const generateSignature = (req, res, next) =>{
    const {folder} = req.body;

    if(!folder){
        res.status(400).json({message:'files are missing'})
    }

    try{
        const timestamp = Math.round(new Date().getTime() / 1000);

        const signature = cloudinary.utils.api_sign_request({
            timestamp,
            folder
        }, process.env.CLOUDINARY_API_SECRET)

        res.status(200).json({timestamp, signature})
    }catch(err){
        console.log(err)
        res.status(500);
        next(err)
    }
}


const uploadToCloudinary = async(path) =>{
    
    // const parts = originalFilename.split('.')
    // const ext = parts[parts.length -1]
    // const newFileName = `${Date.now()}.${ext}`

    const response = await cloudinary.uploader.upload(path, {folder: 'booking_app_photos'}, (err, result) =>{
        if(err){
            console.log(err)
            return err
        }
        return result
    })
    const obj = {url: response.secure_url, public_id : response.public_id}
    // const link = `https://${bucket}.s3.amazonaws.com/${newFileName}`
    // console.log(link)
    return obj

}

// Middleware to delete images from s3 bucket
const deleteFromCloudinary = async(file) =>{
    

    // const fileName = file.split('/')[file.split('/').length - 1]

    // const response = await client.send(new DeleteObjectCommand({
    //     Bucket:bucket,
    //     Key:fileName,
    // }))

    const response = await cloudinary.uploader.destroy(`booking_app_photos/${file.public_id}` ,
    (error,result)=>{
        return result
    })
    return response
}

module.exports = {uploadToLocal, uploadToCloudinary, deleteFromCloudinary}

// [
//     {
//       fieldname: 'photos',
//       originalname: 'pro.jpg',
//       encoding: '7bit',
//       mimetype: 'image/jpeg',
//       destination: 'C:\\Users\\Sujal Gupta\\Desktop\\HTML Instructions file\\PRACTICE FOLDERS\\Mern_project_1-booking_app\\api\\public\\tmp',
//       filename: 'a7fb14b510aed43a1107ad97c024c3eb',
//       path: 'C:\\Users\\Sujal Gupta\\Desktop\\HTML Instructions file\\PRACTICE FOLDERS\\Mern_project_1-booking_app\\api\\public\\tmp\\a7fb14b510aed43a1107ad97c024c3eb',
//       size: 33911
//     }
//   ]