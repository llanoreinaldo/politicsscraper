//Initialize required node.js dependencies 
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const mongoose = require("mongoose");

// const path = require('path');
const axios = require("axios");
const cheerio = require("cheerio");
const htmlRouter = require('./routes/htmlRoutes.js')
const apiRouter = require('./routes/apiRoutes.js')

//Require all models
var db = require("./models");

var PORT = process.env.PORT || 3307;


// Initialize Express
var app = express();


//Configure middleware

//Use morgan logger for logging requests
app.use(logger("dev"));
//Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true}));
//Use express.static to server the public folder as a static directory
app.use(express.static("public"));
app.use('/', htmlRouter);
app.use('/api', apiRouter);


//Handlebars
const exphndlbrs = require("express-handlebars");
app.engine("handlebars", exphndlbrs({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");


//Connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines"

mongoose.Promoise = Promise;
mongoose.connect(MONGODB_URI);

// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });
  