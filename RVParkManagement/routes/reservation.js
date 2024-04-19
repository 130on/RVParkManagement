var express = require('express');
var router = express.Router();

var dbCon = require('../lib/database');

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("reservation.js: POST");

  const reservationType = req.query.type;
  const size = req.query.rvSize;
  const pricePerNight = req.query.pricePerNight;
  const fromDate = req.query.fromDate;
  const toDate = req.query.toDate;

  console.log("Parameters:", reservationType, size, pricePerNight, fromDate, toDate);

  sql = "CALL check_availability(?, ?, ?, ?, ?);";
  dbCon.query(sql, [reservationType, size, pricePerNight, fromDate, toDate], function (err, openSiteReservations) {
    if (err) {
      throw err;
    }

    if (openSiteReservations.length > 0) {
      const siteReservations = openSiteReservations[0];
      console.log("reservation.js: these are the open reservations: ", siteReservations);
      res.render('reservation', { siteReservations: siteReservations, fromDate, toDate });
    }
    else {
      console.log("reservation.js: there are no open reservations with these parameters.");
      res.render('reservation', { siteReservations: [] });
    }
  });
});

router.post('/', function(req, res, next) {
  console.log("reservation.js: POST");

  res.redirect('/payment');
});

module.exports = router;
