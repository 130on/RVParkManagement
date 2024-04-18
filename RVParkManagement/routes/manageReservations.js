var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("manageReservations.js: GET");
  res.render('manageReservations', { });
});

router.post('/', function(req, res, next) {
  console.log("manageReservations.js: POST");
  res.redirect('/manageReservations');
});

module.exports = router;
