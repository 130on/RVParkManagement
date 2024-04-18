var express = require('express');
var router = express.Router();

var dbCon = require('../lib/database');

/* GET page. */
router.get('/', function (req, res, next) {
    console.log("loginuser.js: GET");
    res.render('loginuser', {});
});

/* POST page. */
router.post('/', function (req, res, next) {
    console.log("loginuser.js: POST");
    console.log("The logged in variable is'" + req.session.loggedIn + "'");
    console.log("The email in variable is'" + req.body.email + "'");
    console.log("The hashedPassword in variable is'" + req.body.hashedPassword + "'");
    //if (!req.session.loggedIn && req.body.username != "") {
    if (req.body.hashedPassword) {
        // User is submitting user/password credentials
        const email = req.session.email;
        const hashedPassword = req.body.hashedPassword;
        const sql = "CALL check_credentials('" + email + "', '" + hashedPassword + "')";
        dbCon.query(sql, function (err, results) {
            if (err) {
                throw err;
            }
            console.log("loginuser.js: Obtained result from accounts table below");
            console.log(results);
            if (results[0][0] === undefined || results[0][0].result == 0) {
                console.log("loginuser.js: No login credentials found");
                res.render('loginuser', { message: "Password not valid for user '" + email + "'.  Please log in again." });
            }
            else {
                console.log("loginuser.js: Credentials matched");
                req.session.loggedIn = true;
                res.redirect("/");
            }
        });
    }
    else if (req.body.email != "") {
        const email = req.body.email;
        console.log("loginuser.js: email is: " + email);
        const sql = "CALL get_salt('" + email + "')";
        dbCon.query(sql, function (err, results) {
            if (err) {
                throw err;
            }
            if (results[0][0] === undefined) {
                console.log("loginuser: No results found");
                res.render('loginuser', { message: "User '" + email + "' not found" });
            } else {
                const salt = results[0][0].salt;
                req.session.email = email;
                req.session.salt = salt;
                res.render('loginpassword', {
                    email: email,
                    salt: salt
                });
            }
        });

    }

});

module.exports = router;
