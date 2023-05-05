const mongoose = require("mongoose")

const {Schema} = mongoose

const placeSchema = new Schema({
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    title:{
        type: String,
        required: true
    },
    address:{
        type: String,
        required: true,
    },
    images:{
        type: [String],
        required: true,
    },
    description:{
        type: String,
    },
    perks:{
        type: [String],
    },
    extraInfo:{
        type: String,
    },
    checkIn: {
        type:Number,
        required: true
    },
    checkOut: {
        type:Number,
        required: true
    },
    maxGuests: {
        type:Number
    },
    price:{
        type: Number,
        required: true
    }

})


module.exports = mongoose.model("Place", placeSchema)