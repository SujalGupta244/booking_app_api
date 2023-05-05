// put our .env file content in process.env 
require("dotenv").config()

// check for errors in route requests
require("express-async-errors")

const express = require('express')
const app = express()
const cors = require('cors')
const path = require("path")
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser");
const corsOptions = require("./config/corsOptions")
const dbConnect = require("./config/dbConnect")

const PORT = process.env.PORT || 4000;


// Connection to database
dbConnect()


// Allows us to use any file from public folder into any folder directly
app.use("/", express.static(path.join(__dirname,"public"))) // app.use(express.static("public"))
// app.use("/upload", express.static(path.join(__dirname,"public","uploads"))) 

// Route use to show html page directly by backend
app.use("/", require('./routes/root'))


// Middleware that allow to communicate using json format only
app.use(express.json())

// Middleware to accept requests from different URLs
app.use(cors(corsOptions))


// Middleware that allow to access the cookie from frontend request
app.use(cookieParser())

// Different Routes for different request from frontend
app.use("/users", require("./routes/userRoutes"))

app.use('/auth', require('./routes/authRoutes'))

app.use('/upload', require("./routes/uploadRouter"))

app.use('/places', require("./routes/placesRouter"))
app.use('/booking', require("./routes/bookingRouter"))


// For any route not known 
app.all("*", (req, res) => {
    res.status(404);
    if (req.accepts("html")) {
      res.send(`<h1>404</h1> <h3>NOT FOUND</h3>`);
    } else if (req.accepts("json")) {
      res.json({ error: "404 Not Found" });
    } else {
      res.type("txt").send("404 Not found");
    }
  });

  
mongoose.connection.once("open",()=>{
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Listening at ${PORT}`));
})
  

mongoose.connection.on('error',err =>{
    console.log(err);
    console.log(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`)
})