var express = require('express');
var router = express.Router();

var dbCon = require('../lib/database');

/* GET home page. */
router.get('/', function (req, res, next) {

    // query DB to get userId
    const userName = req.session.username;
    console.log("This is the userName: ", userName);

    var userId;
    var userRoldId;
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

            sql = "CALL get_usertype_id('" + userId + "');";
            dbCon.query(sql, function (err, result) {
                if (err) {
                    console.log("home.js: call to get_usertype_id failed");
                    throw err;
                }
                if (result.length > 0) {
                    console.log("home.js: this is the result of Call to get_user_type_id: ", result);
                    userRoldId = parseInt(result[0][0].user_role_id);
                    console.log("home.js: This is the user_role_id: ", userRoldId);

                    if (userRoldId == 2) {
                        res.redirect("/adminView");
                    }
                    else if (userRoldId == 3) {
                        res.redirect('/employeeView');
                    }
                    else {
                        res.render("home");
                    }
                }
                else {
                    console.log("Could not find user_role_id for userId: ", userId);
                }

            })
        }
        else {
            console.log("Could not find userID for userName: ", userName);
            res.render("loginuser");
        }
    });


})

module.exports = router;


