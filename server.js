//Initialize required node.js dependencies 
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var path = require('path');
var axios = require("axios");
var cheerio = require("cheerio");

//Require all models
var db = require("./models");

var PORT = orocess.env.PORT || 3307;

// Initialize Express
var app = express();

//Configure middleware

//Use morgan logger for logging requests
app.use(logger("dev"));
//Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true}));
//Use express.static to server the public folder as a static directory
app.use(express.static("public/"));

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
  