var express = require('express');
var router = express.Router();

var dbCon = require('../lib/database');

/* GET home page. */
router.get('/', function (req, res, next) {
    console.log("holidayDates.js: GET");


    // let sql = "CALL get_users;"
    // dbCon.query(sql, function (err, usersResult) {
    //     if (err) {
    //         console.log("holidayDates.js: Query to get usernames failed");
    //         throw err;
    //     }
    //     if (usersResult.length > 0) {
    //         console.log("adminview.js: these are the users' names: ", usersResult);

    //         res.render('adminView', { users: usersResult, username });
    //     }
    //     res.render('holidayDates');


    // });

    res.render('holidayDates');

});

module.exports = router;
