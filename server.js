//Initialize required node.js dependencies 
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");

//Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

//Configure middleware

//Use morgan logger for logging requests
app.use(logger("dev"));
//Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true}));
//Use express.static to server the public folder as a static directory
app.use(express.static("public"));

//Connect to the Mongo DB
mongoose.connect("mongodb://localhost/mongoHeadlines")
