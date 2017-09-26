var express = require('express');
var router = express.Router();
var Movie = require('../models/movie');

/* GET home page. */
router.get('/', function(req, res, next) {
  Movie.fetch(function(err, movies) {
    if(err) console.log(err);
    
    res.render('pages/index', {
      title: '首页',
      movies: movies
    })
  });
  
  res.render('pages/index');
});

module.exports = router;
