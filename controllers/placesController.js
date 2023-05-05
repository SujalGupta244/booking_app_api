const Place = require("../models/Place")
const User = require("../models/User")
const asyncHandler = require('express-async-handler')
const jwt = require("jsonwebtoken")


const getAllPlaces = async(req, res) =>{
    const places = await Place.find()

    if(!places){
        res.status(400).json({message: "no places found"})
    }

    return res.json(places)   
}


const getUserPlaces = (req, res) =>{
    
    const cookies = req.cookies
    if(!cookies?.jwt) res.status(401).json({message: "Unauthorized, You are not loggedIn"}) // 401 Unauthorized

    const refreshToken = cookies.jwt

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_KEY,
        asyncHandler(async(err, decoded) =>{
            if(err) return res.status(403).json({message: "Forbidden"})

            const user = await User.findOne({email: decoded.email})
            // .populate('places')

            if(!user) return res.status(401).json({message: "Unauthorized"})
            
            const places = await Place.find({owner: user.id})

            return res.json(places)
        })    
    )



}

const getPlacebyId = (req, res) =>{
    
    const cookies = req.cookies
    if(!cookies?.jwt) res.status(401).json({message: "Unauthorized, You are not loggedIn"}) // 401 Unauthorized

    const refreshToken = cookies.jwt
    const {id} = req.params 

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_KEY,
        asyncHandler(async(err, decoded) =>{
            if(err) return res.status(403).json({message: "Forbidden"})

            const user = await User.findOne({email: decoded.email})

            if(!user) return res.status(401).json({message: "Unauthorized"})
            
            const place = await Place.find({_id: id})
            res.json(place[0])
        })    
    )



}



const addPlaces = asyncHandler((req, res) => {
    const cookies = req.cookies
    const {title, address, photoLink, addedPhotos, description, perks, extraInfo, checkIn, checkOut, maxGuests, price} = req.body.data
    if(!cookies?.jwt) res.status(401).json({message: "Unauthorized, You are not loggedIn"}) // 401 Unauthorized

    if(!title || !address || !description || !perks || !extraInfo || !checkIn || !checkOut || !maxGuests || !price){
        res.status(400).json({message: "Some fields are missing"})
    }

    const refreshToken = cookies.jwt

    // console.log(refreshToken);
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_KEY,
        asyncHandler(async(err, decoded) =>{
            if(err) return res.status(403).json({message: "Forbidden"})

            const foundUser = await User.findOne({email: decoded.email})

            if(!foundUser) return res.status(401).json({message: "Unauthorized"})

            // console.log(foundUser);
            const placeObject = {
                owner: foundUser._id,
                title,
                address,
                images: addedPhotos,
                description,
                perks,
                extraInfo,
                checkIn,
                checkOut,
                maxGuests,
                price
            }

            const place = await Place.create(placeObject) 
            
            if(!place){
                res.status(400).json({message: "Invalid user data received"}); // 400 Bad request
            }

            foundUser.places.push(place)
            await foundUser.save()
            res.json(place)
            
        })    
    )

})

const updatePlace = asyncHandler((req, res) => {
    const cookies = req.cookies

    const {id} = req.params 

    const {title, address, addedPhotos, description, perks, extraInfo, checkIn, checkOut, maxGuests, price} = req.body.data
    if(!cookies?.jwt) res.status(401).json({message: "Unauthorized, You are not loggedIn"}) // 401 Unauthorized

    if(!title || !address || !description || !perks || !extraInfo || !checkIn || !checkOut || !maxGuests || !price){
        res.status(400).json({message: "Some fields are missing"})
    }

    const refreshToken = cookies.jwt

    // console.log(refreshToken);
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_KEY,
        asyncHandler(async(err, decoded) =>{
            if(err) return res.status(403).json({message: "Forbidden"})

            const foundUser = await User.findOne({email: decoded.email})

            if(!foundUser) return res.status(401).json({message: "Unauthorized"})

            // console.log(foundUser);

            const place = await Place.findById(id).exec()
            place.title = title
            place.address = address
            place.images = addedPhotos
            place.description = description
            place.perks = perks
            place.extraInfo = extraInfo
            place.checkIn = checkIn
            place.checkOut = checkOut
            place.maxGuests = maxGuests
            place.price = price

            const updatedPlace = await place.save()

            if(!updatedPlace){
                res.status(400).json({message: "Invalid user data received"}); // 400 Bad request
            }

            // console.log(updatedPlace);
            return res.json(updatedPlace)
        })    
    )

})


    
        // console.log(req.headers.authorization);
        // const authHeader = req.headers.authorization || req.headers.Authorization
    
        // if(!authHeader?.startsWith("Bearer ")){
        //     return res.status(401).json({message: "Unauthorization"})
        // }
    
        // const token = authHeader.split(' ')[1]
        // jwt.verify(
        //     token,
        //     process.env.ACCESS_TOKEN_KEY,
        //     (err, decoded) =>{
        //         if(err) return res.status(403).json({message: "Forbidden"})
        //         // req.user = decoded.UserInfo.username
        //         // req.roles = decoded.UserInfo.roles
        //         // next()
        //         console.log(decoded);
        //     }
        // )
    
module.exports = {getAllPlaces, getUserPlaces ,addPlaces, getPlacebyId, updatePlace}






