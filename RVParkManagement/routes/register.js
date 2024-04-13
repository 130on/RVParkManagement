var express = require('express');
var router = express.Router();

var dbCon = require('../lib/database');
/* GET page. */
router.get('/', function(req, res, next) {
    console.log("register.js: GET");
    res.render('register', { });
});

/* POST page. */
router.post('/', function(req, res, next) {
    
    console.log("register.js: POST");
    
    // Get values from POST from the client
    const email = req.body.email;
    const salt = req.body.salt;
    const hash = req.body.hash;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const phoneNumber = req.body.phoneNumber;
    console.log("register.js: email: " + email + " salt: " + salt + " hash: " + hash);
    let sql = "CALL register_user(?, ?, ?, ?, ?, ?, @result); select @result";
    dbCon.query(sql, [email, hash, salt, firstname, lastname, phoneNumber], function(err, rows) {
       if (err) {
        throw err;
       } 
       if (rows[1][0]['@result'] == 0) {
            // Successful registration!
            // Set the sessions variable for this
            req.session.email = email;
            req.session.loggedIn = true;

            // Since session updates aren't synchronous and automatic because they are inserted into the MySQL database
            // we have to wait for the database to come back with a result.  req.session.save() will trigger a function when 
            // the save completes
            req.session.save(function(err) {
                if (err) {
                    throw err;
                }
                console.log("register.js: Successful registration, a session field is: " + req.session.email);
                
                // Redirect the user to the home page.  Let that redirect the user to the next correct spot.
                res.redirect('/');
            });
        } else {
            //This user account already exists
            console.log("register.js: Email already exists.  Reload register page with that message.");
            res.render('register', {message: "The email '" + email + "' already exists"});
        }
    });
    
    // sql = "CALL add_checking_account(?, ?);";
    // dbCon.query(sql, [email, 0], function(err, rows) {
    //    if (err) {
    //     throw err;
    //    } 
    // });

    // sql = "CALL add_savings_account(?, ?);";
    // dbCon.query(sql, [email, 0], function(err, rows) {
    //    if (err) {
    //     throw err;
    //    } 
    // });
    
});

module.exports = router;