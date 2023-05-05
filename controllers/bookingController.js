const Booking = require('../models/Booking')
const User = require('../models/User')
const asyncHandler = require('express-async-handler')
const jwt = require("jsonwebtoken")

const getBookingsOfUser = async(req, res) =>{
    const cookies = req.cookies
    if(!cookies?.jwt) res.status(401).json({message: "Unauthorized, You are not loggedIn"}) // 401 Unauthorized
    const refreshToken = cookies.jwt
    
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_KEY,
        asyncHandler(async(err, decoded) =>{
            if(err) return res.status(403).json({message: "Forbidden"})
            
            const foundUser = await User.findOne({email: decoded.email})
            // .populate('places')

            if(!foundUser) return res.status(401).json({message: "Unauthorized"})

            const bookings = await Booking.find({user: foundUser._id}).populate('place')

            if(!bookings) res.status(403).json({message: "No bookings"})

            res.json(bookings)
            
        })
    )
}




const bookPlace = async(req, res) =>{
    const cookies = req.cookies
    const {checkIn, checkOut, name, mobileNo, guests, place, price} = req.body
    
    if(!cookies?.jwt) res.status(401).json({message: "Unauthorized, You are not loggedIn"}) // 401 Unauthorized
    
    if(!checkIn || !checkOut || !name ||  !mobileNo || !guests || !place || !price){
        res.status(400).json({message: "some fields are missing"})
    }
    
    const refreshToken = cookies.jwt
    
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_KEY,
        asyncHandler(async(err, decoded) =>{
            if(err) return res.status(403).json({message: "Forbidden"})
            const foundUser = await User.findOne({email: decoded.email})
            // .populate('places')

            if(!foundUser) return res.status(401).json({message: "Unauthorized"})
            
            const bookingObj = {price, checkIn ,checkOut , name, mobileNo, guests, place, user: foundUser._id}
        
            const booking = await Booking.create(bookingObj)
        
            if(!booking){
                res.status(400).json({message: "Invalid booking details"})
            }

            foundUser.bookings.push(booking)
            await foundUser.save()

            res.status(201).json(booking)
            
        })
    )

    




} 

module.exports = {getBookingsOfUser ,bookPlace}
