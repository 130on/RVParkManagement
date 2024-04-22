var express = require('express');
var router = express.Router();

var dbCon = require('../lib/database');

/* GET home page. */
router.get('/', function (req, res, next) {
    var userToEdit = req.query.userToEdit;

    let sql = "CALL get_user_info('" + userToEdit + "');";
    dbCon.query(sql, function (err, userResult) {
        if (err) {
            console.log("editAccountAdmin.js: query to get user info failed");
            throw err;
        }
        if (userResult.length > 0) {
            console.log("editAccountAdmin.js: the user's info is: ", userResult);

            res.render('editAccountAdmin', { result: userResult });
        }
    })

});

module.exports = router;
