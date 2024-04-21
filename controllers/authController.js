const User = require("../models/User")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const asyncHandler = require('express-async-handler')


// @desc Register
// @route POST /auth/register
// @access Public
const register = asyncHandler(async (req, res) =>{
    const {username, email, password} = req.body
    if(!username || !email || !password){
        return res.status(400).json({message: "some fields are missing"}); // 400 bad request
    }
    
    // Check for duplicate
    const duplicate = await User.findOne({email}).collation({locale: "en", strength: 2}).lean().exec();

    if(duplicate){
        return res.status(422).json({message: "User with this email already exists"}); // 422 Unprocessable Content request
    }

    // Hash Password
    const hashPassword = await bcrypt.hash(password,10);
    
    const userObject = {username, email, password : hashPassword, places: [], bookings:[]}
    
    // Create and store new user
    const user = await User.create(userObject)

    if(user){ // if created
        return res.status(201).json({message: `new user ${username} created`}) // 201 new creation request
    }else{
        return res.status(400).json({message: "Invalid user data received"}); // 400 bad request
    }
})

// @desc Login
// @route POST /auth/login
// @access Public
const login = asyncHandler(async (req, res) =>{
    const {email, password} = req.body
    if( !email || !password){
        return res.status(400).json({message: "some fields are missing"}); // 400 bad request
    }

    // Find and store existing user
    const user = await User.findOne({email}).lean()

    if(!user){
        return res.status(401).json({message: "Unauthorized"}) // 401 Unauthorised access
    }
    
    // Checks the password
    const match = await bcrypt.compare(password, user.password)

    if(!match){
        return res.status(409).json({message: "Username/password is Invalid"}); // 409 Unauthorized request
    }

    const responseToken = jwt.sign(
        {username: user.username, email: user.email},
        process.env.REFRESH_TOKEN_KEY,
        {expiresIn: "7d"}
    )

    const accessToken = jwt.sign(
        {
            username: user.username,
            email: user.email            
        },
        process.env.ACCESS_TOKEN_KEY,
        {expiresIn: "15m"}
    )

    // Create secure cookie with refresh token
    res.cookie("jwt", responseToken,{
        httpOnly: true, // accessible only by web server
        secure: true, // https - accesible only on https requests
        sameSite: 'None', // cross-site cookie
        maxAge: 7*24*60*60*1000 //cookies expiry : set to match 
    })

    res.json({accessToken})
}
)


// @desc Refresh
// @route GET /auth/refresh
// @access Public
const refresh = asyncHandler(async(req, res) =>{
    const cookies = req.cookies
    if(!cookies?.jwt) return res.status(401).json({message: "Unauthorized, You are not loggedIn"})

    const refreshToken = cookies.jwt

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_KEY,
        asyncHandler(async(err, decoded) =>{
            if(err) return res.status(403).json({message: "Forbidden"})

            const user = await User.findOne({email: decoded.email})

            if(!user) return res.status(401).json({message: "Unauthorized"})

            const accessToken = jwt.sign(
                {
                    username: user.username,
                    email: user.email            
                },
                process.env.ACCESS_TOKEN_KEY,
                {expiresIn: "15m"}
            )
        
            res.json({accessToken})
        })
    )
})



// @desc Logout
// @route POST /auth/logout
// @access Public
const logout = asyncHandler(async(req, res) =>{
    const cookies = req.cookies
    
    if(!cookies?.jwt)return res.sendStatus(204); //No content
    
    res.clearCookie("jwt",{httpOnly: true, sameSite: "None", secure: true}); //secure: true - only serves on https

    res.json({message:"cookie cleared"})
})


module.exports = {register, login, refresh, logout}




