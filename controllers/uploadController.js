const Place = require("../models/Place")

const imageDownloader = require("image-downloader")
const path = require("path")
const fs = require("fs")
const mime = require("mime-types")
const {uploadToS3} = require("../middleware/photosMiddleware")

const uploadByLink = async (req, res) =>{
    const {link} = req.body
    const newName = Date.now() + '.jpg'
    const newPath = path.join(__dirname, '..', "public", 'tmp', newName)
     await imageDownloader.image({
        url: link,
        dest: newPath
    })
    const url = await uploadToS3(newPath, newName, mime.lookup(newPath))
    res.json(url)
}



const uploadDirect = async (req, res) =>{
    const files = req.files
    console.log(req.files)
    if(!files || !files.length){
        res.status(400).json({message:'files are missing'})
    }

    const uploadedFiles = [];

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
}

const removeDirect = async(req, res) =>{
    const {id, name} = req.body
    if(!id || !name || !fs.existsSync(path.join(__dirname,"..", "public","uploads", name))){
        res.status(400).json({message: 'file not found'})
    }

    const place = await Place.findById(id).exec()
    if(!place){
        res.status(400).json({message: "place not found"})
    }

    const filterImages = place.images.filter(image => image != name)
    place.images = filterImages
    await place.save()

    // console.log((req.body));
    fs.unlink(path.join(__dirname,"..", "public","uploads", name), (err) => {
        // res.status(400).json({message: err.message})
        if(err){
            console.log(err);
        }
    })
    res.json({message: "photo deleted successfully"})
}


// console.log(path.join(__dirname, "public","uploads", filename));
// fsPromise.appendFile(path.join(__dirname,'..' , 'uploads','in.html'),'html file')
// .then(res => console.log(res))
// .catch(rej => console.log(rej))


module.exports = {uploadByLink, uploadDirect, removeDirect}

