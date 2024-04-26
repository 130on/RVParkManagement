var express = require('express');
var router = express.Router();

var dbCon = require('../lib/database');


/* GET home page. */
router.get('/', function (req, res, next) {
  console.log("editSiteInput.js: GET");

  res.render('editSiteInput', {});

  // var userId;
  // let sql = "SELECT user_id\n" +
  //   "FROM users\n" +
  //   "WHERE username = (?);\n";


});

router.post('/', function (req, res, next) {
  console.log("editSiteInput.js: POST");

  const siteNumber = req.body.siteNumber;

  console.log("Parameters:", siteNumber);

  res.redirect('editSite?siteNumber=' + siteNumber);

});
module.exports = router;

