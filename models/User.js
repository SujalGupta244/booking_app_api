const mongoose = require("mongoose")

const {Schema} = mongoose

const userSchema = new Schema({
    username:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    places: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Place',
        required: true
    }],
    bookings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: true
    }],
})


module.exports = mongoose.model("User",userSchema)