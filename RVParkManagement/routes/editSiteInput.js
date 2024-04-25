var express = require('express');
var router = express.Router();

var dbCon = require('../lib/database');


/* GET home page. */
router.get('/', function (req, res, next) {
  console.log("editSiteInput.js: GET");

  res.render('editSiteInput', { });

  // var userId;
  // let sql = "SELECT user_id\n" +
  //   "FROM users\n" +
  //   "WHERE username = (?);\n";


});

router.post('/', function (req, res, next) {
  console.log("editSiteInput.js: POST");

  const siteNumber = req.body.siteNumber;

  console.log("Parameters:", siteNumber);

  // sql = "CALL remove_site(?);";
  // dbCon.query(sql, [siteNumber], function (err, results) {
  //   if (err) {
  //     throw err;
  //   }

    // sql = "CALL create_reservation(?, ?, ?, ?, ?, ?, ?, ?, ?, @result); SELECT @result";
    // dbCon.query(sql, [req.session.userId, reservationType, siteId, paymentId, size, todaysDate, 'Active', fromDate, toDate], function (err, results) {
    //   if (err) {
    //     throw err;
    //   }
    //   const reservationId = results[1][0]['@result'];
    //   console.log("Reservation ID:", reservationId);

       res.redirect('removeSite?site_number=' + siteNumber)
    // });
  // });
});

module.exports = router;

