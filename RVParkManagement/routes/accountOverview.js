var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('accountOverview', { title: 'Hello World' });
});

module.exports = router;
