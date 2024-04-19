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

      sql = "CALL get_reservations('" + userId + "');";
      dbCon.query(sql, function (err, reservationResult) {
        if (err) {
          console.log("manageReservations.js: procedure get_reservations failes");
          throw err;
        }

        if (reservationResult.length > 0) {
          var result = reservationResult;
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
    }
  });




  // res.render('manageReservations', {});
});


/* POST page*/
router.post('/', function (req, res, next) {
  console.log("manageReservations.js: POST");
  res.redirect('/manageReservations');
});

module.exports = router;
