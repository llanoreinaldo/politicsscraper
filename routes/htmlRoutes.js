const router = require('express').Router();
const db = require('../models/Index.js');

router.get('/', (req, res) => {
    db.Article.find()
    .populate('note')
    .sort({_id: -1})
    .then( (results) => {
        //res.json(results);
        res.render('index', {results: results});
    })
    .catch( (err) => res.json(err) );
});

router.get('/pinned', (req, res) => {
    db.Article.find({pinned: true})
    .populate('note')
    .sort({_id: -1})
    .then( (results) => {
        //res.json(results);
        res.render('index', {results: results});
    })
    .catch( (err) => res.json(err) );
});

module.exports = router;