var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("reservation.js: POST");
  res.render('reservation', { });
});

router.post('/', function(req, res, next) {
  console.log("reservation.js: POST");

  res.redirect('/payment');
});

module.exports = router;
