var express = require('express');
var router = express.Router();

var dbCon = require('../lib/database');

/* GET page. */
router.get('/', function (req, res, next) {
  console.log("manageReservations.js: GET");

  // query DB to get userId
  const userName = req.session.username;
  console.log("This is the userName: ", userName);

  var userId;
  let sql = "SELECT user_id\n" +
    "FROM users\n" +
    "WHERE username = '" + userName + "';\n";

  dbCon.query(sql, function (err, results) {
    if (err) {
      console.log("index.js: Query to find userId failed");
      throw err;
    }
    if (results.length > 0) {
      userId = parseInt(results[0].user_id);
      req.session.userId = userId;
      console.log("loginuser.js: The userId is: ", userId);

      sql = "CALL get_reservations(?);";
      dbCon.query(sql, [userId], function (err, reservationResult) {
        if (err) {
          console.log("manageReservations.js: procedure get_reservations failed");
          throw err;
        }

        if (reservationResult.length > 0) {
          const result = reservationResult[0];
          console.log("manageReservations.js: this is the summary info: ", result);
          res.render('manageReservations', { result: result });
        }
        else {
          console.log("manageReservations.js: the reservationResult is empty");
          res.render('manageReservations', { result: [] });
        }
      });
    } else {
      console.log("No userId found with the username provided");
      console.log("This is the userName: ", userName);
      res.render('manageReservations', { result: [] });
    }
  });
});


/* POST page*/
router.post('/', function (req, res, next) {
  console.log("manageReservations.js: POST");

  //run cancel reservation here
  var user_id = req.session.userId;
  var reservation_id = req.body.reservation_id;
  console.log("manageReservations.js: POST - This is the userID: ", user_id);
  console.log("manageReservations.js: POST - This is the reservationID: ", reservation_id);

  let sql = "CALL cancel_reservation(?);";
  dbCon.query(sql, [reservation_id], function (err, result) {
    if (err) {
      console.log("manageReservations.js: procedurecancel_reservations failed");
      throw err;
    }

    if (result.lenth > 0) {
      console.log("manageReservations.js: POST - reservation was canceled successfully");
    }

    res.redirect('/manageReservations');
  });


});

module.exports = router;
