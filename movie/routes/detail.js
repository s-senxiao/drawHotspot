var express = require('express');
var router = express.Router();
var Movie = require('../models/movie');

/* GET home page. */
router.get('/', function(req, res, next) {
  var id = req.params.id;
  Movie.findById(id, function(err, movie) {
    if(err) console.log(err);
    
    if(!err && movie) {
      res.render('pages/detail', {
        title: '详情页',
        movie: movie
      })
    }
  })
  
  res.render('pages/detail');
});

module.exports = router;
