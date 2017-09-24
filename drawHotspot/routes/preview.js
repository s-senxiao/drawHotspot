var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('preview', { title: '预览' });
});

router.post('/', function(req, res, next) {
  var codes = req.body.codes;
  
  res.render('preview', {
    title: '预览',
    codes: codes
  });
});

module.exports = router;
