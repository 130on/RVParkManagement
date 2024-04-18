var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("checkAvailability.js: GET");
  res.render('checkAvailability', { });
});

router.post('/', function(req, res, next) {
  console.log("checkAvailability.js: POST");
  res.redirect('/reservation');
});

module.exports = router;
