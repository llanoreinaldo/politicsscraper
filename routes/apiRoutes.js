const db = require('../models/Index.js');
const request = require("request");
const axios = require("axios");
const cheerio = require('cheerio');
const router = require("express").Router();
const bodyParser = require("body-parser");
const logger = require("morgan");

// A GET route for scraping the echoJS website
router.get("/scrape", function (req, res) {
  // First, we grab the body of the html with request
  axios.get("http://www.politico.com/").then(function (response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    const $ = cheerio.load(response.data);

    // Now, we grab every h1 within an article tag, and do the following:
    $("section h1").each(function (i, element) {
      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      $('article').each((index, element) => {
        let data = {};
        $('a.js-tealium-tracking', element).each((index2, element2) => {
          if (index2 == 0) data.title = $(element2).text();
        });
        if (data.title.length == 0) {
          data.title = $('p', element).text();
        } else {
          data.desc = $('p', element).text();
        }
        data.link = $('a.js-tealium-tracking', element).attr("href");
        results.push(data);
      });
      //Create a new Article using the `result` object built from scraping
      db.Article.insertMany(results.reverse(), {
        ordered: false,
        rawResult: false
      }, (err, docs) => {
        res.json({
          errors: err,
          results: docs
        });
        // View the added result in the console
        console.log(dbArticle);
      });
    });
  });
});


// Route for getting all Articles from the db
router.get("/articles", function (req, res) {
  // Grab every document in the Articles collection
  db.Article.find({})
    .then(function (dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for grabbing a specific Article by id, populate it with it's note
router.get("/articles/:id", function (req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOne({
      _id: req.params.id
    })
    // ..and populate all of the notes associated with it
    .populate("note")
    .sort({
      _id: -1
    })
    .then(function (dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
router.post("/articles/:id", function (req, res) {
  // Create a new note and pass the req.body to the entry
  db.Note.create(req.body)
    .then(function (dbNote) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate({
        _id: req.params.id
      }, {
        note: dbNote._id
      }, {
        new: true
      });
    })
    .then(function (dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for pinning an Article
router.post('/pins/:articleId', (req, res) => {
  let articleId = req.params.articleId;
  db.Article.findOneAndUpdate({
      _id: articleId
    }, {
      $set: {
        pinned: req.body.pin
      }
    }, {
      new: true
    })
    .then(updatedArticle => res.json(updatedArticle))
    .catch(err => res.json(err));
});
''
module.exports = router