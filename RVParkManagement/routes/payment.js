var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("payment.js: GET");
  res.render('payment', { });
});

router.post('/', function(req, res, next) {
  console.log("payment.js: POST");
  res.redirect('/confirmation');
});

module.exports = router;
