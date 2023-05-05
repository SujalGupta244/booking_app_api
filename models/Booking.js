const mongoose = require("mongoose")

const {Schema} = mongoose

const bookingSchema = new Schema({
    checkIn:{
        type: Date,
        required: true
    }, 
    checkOut:{
        type: Date,
        require: true
    }, 
    name:{
        type: String,
        required: true
    }, 
    mobileNo:{
        type: Number,
        required: true
    }, 
    guests:{
        type: Number,
        required: true
    }, 
    price:{
        type: Number,
        required: true
    },
    place:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'Place'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'User'
    }
})


module.exports = mongoose.model("Booking",bookingSchema)