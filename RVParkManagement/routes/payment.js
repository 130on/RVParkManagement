var express = require('express');
var router = express.Router();

var dbCon = require('../lib/database');

// Function to format a date as mm/dd/yyyy
function formatDate(date) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return year + '-' + month + '-' + day;
}

// Function to parse yyyy-mm-dd formatted date strings into Date objects
function parseDate(dateString) {
  console.log(dateString);
  const parts = dateString.split('-');
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);
  return new Date(year, month - 1, day); // Month in JavaScript Date object is 0-based
}


/* GET home page. */
router.get('/', function (req, res, next) {
  console.log("payment.js: GET");
  res.render('payment', {});

  var userId;
  let sql = "SELECT user_id\n" +
    "FROM users\n" +
    "WHERE username = (?);\n";

  dbCon.query(sql, [req.session.username], function (err, results) {
    if (err) {
      console.log("index.js: Query to find userId failed");
      throw err;
    }
    if (results.length > 0) {
      userId = parseInt(results[0].user_id);
      req.session.userId = userId;
      console.log("loginuser.js: The userId is: ", userId);
    }
  });

});

router.post('/', function (req, res, next) {
  console.log("payment.js: POST");

  const siteId = req.query.site_id;
  const reservationType = req.query.type;
  var size = req.query.rvSize;
  if (size == '') {
    size = null;
  }
  const pricePerNight = req.query.pricePerNight;
  const fromDate = req.query.fromDate;
  const toDate = req.query.toDate;

  const cardNumber = req.body.cardNumber;

  const fromDateObj = parseDate(fromDate);
  const toDateObj = parseDate(toDate);
  const oneDay = 24 * 60 * 60 * 1000;
  const daysDifference = Math.round(Math.abs((fromDateObj - toDateObj) / oneDay));
  const amount = daysDifference * pricePerNight;

  const todaysDate = formatDate(new Date());

  console.log("Parameters:", siteId, size, pricePerNight, fromDate, toDate);

  sql = "CALL make_payment(?, ?, ?, ?, ?, ?, @result); SELECT @result";
  dbCon.query(sql, [cardNumber, amount, todaysDate, 'Active', 'New Reservation', req.session.userId], function (err, results) {
    if (err) {
      throw err;
    }
    const paymentId = results[1][0]['@result'];
    console.log("Payment ID:", paymentId);

    sql = "CALL create_reservation(?, ?, ?, ?, ?, ?, ?, ?, ?, @result); SELECT @result";
    dbCon.query(sql, [req.session.userId, reservationType, siteId, paymentId, size, todaysDate, 'Active', fromDate, toDate], function (err, results) {
      if (err) {
        throw err;
      }
      const reservationId = results[1][0]['@result'];
      console.log("Reservation ID:", reservationId);

      res.redirect('confirmation?reservation_id=' + reservationId)
    });
  });
});

module.exports = router;

