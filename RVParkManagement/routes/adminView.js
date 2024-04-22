var express = require('express');
var router = express.Router();

var dbCon = require('../lib/database');

/* GET home page. */
router.get('/', function (req, res, next) {
  var userToEdit = req.query.userToEdit;

  let sql = "CALL get_users;"
  dbCon.query(sql, function (err, usersResult) {
    if (err) {
      console.log("adminView.js: Query to get usernames failed");
      throw err;
    }
    if (usersResult.length > 0) {
      console.log("adminview.js: these are the users' names: ", usersResult);
      res.render('adminView', { users: usersResult });
    }

    //res.render('adminview');

  });


});

module.exports = router;
