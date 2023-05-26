const multer = require("multer")
const {S3Client, PutObjectCommand, DeleteObjectCommand} = require("@aws-sdk/client-s3")
const path = require("path")
const fs = require("fs")
const bucket = 'sujal-booking-app'

// const photosMiddleware = multer({dest: path.join(__dirname, '..', "public", 'uploads')}).array('photos',100)
const uploadToLocal = multer({dest: path.join(__dirname, '..', "public", 'tmp')}).array('photos',100)



const uploadToS3 = async(path,originalFilename, mimetype) =>{
    const client = new S3Client({
        region: "ap-southeast-2",
        credentials : {
            accessKeyId:process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
        }
    })
    const parts = originalFilename.split('.')
    const ext = parts[parts.length -1]
    const newFileName = `${Date.now()}.${ext}`
    const response = await client.send(new PutObjectCommand({
        Bucket:bucket,
        Body: fs.readFileSync(path),
        Key: newFileName,
        ContentType: mimetype,
        ACL: 'public-read',
    }))
    const link = `https://${bucket}.s3.amazonaws.com/${newFileName}`
    // console.log(link)
    return link

}

// Middleware to delete images from s3 bucket
const deleteFromS3 = async(file) =>{
    const client = new S3Client({
        region: "ap-southeast-2",
        credentials : {
            accessKeyId:process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
        }
    })

    const fileName = file.split('/')[file.split('/').length - 1]

    const response = await client.send(new DeleteObjectCommand({
        Bucket:bucket,
        Key:fileName,
    }))
    return response
}

module.exports = {uploadToLocal, uploadToS3, deleteFromS3}