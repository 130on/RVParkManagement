var express = require('express');
var router = express.Router();

var dbCon = require('../lib/database');

/* GET home page. */
router.get('/', function (req, res, next) {
  console.log("removeSite.js: GET");
  const siteNumber = req.query.siteNumber;

  sql = "CALL get_site(?);";
  dbCon.query(sql, [siteNumber], function (err, manageSite) {
    if (err) {
      throw err;
    }

    if (manageSite.length > 0) {
      const site = manageSite[0];
      console.log("removeSite.js: this is the site: ", site);
      res.render('removeSite', { site: site });
    }
    else {
      console.log("removeSite.js: there is not a site with this Site Number.");
      res.render('removeSite', { site: [] });
    }
  });

});


// Function to format a date as mm/dd/yyyy
function formatDate(date) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return year + '-' + month + '-' + day;
}

const todaysDate = formatDate(new Date());

/* POST page*/
router.post('/', function (req, res, next) {
  console.log("removeSite.js: POST");

  //run cancel reservation here
  const siteNumber = req.body.siteNumber;
  console.log("removeSite.js: POST - This is the site Number: ", siteNumber);

  const siteStatus = req.body.siteStatus;
  console.log("removeSite.js: POST - This is the current status of the site: ", siteStatus);

  let sql = "";


  if (siteStatus === "Active") {
    sql = "CALL remove_site(?, ?);";
    dbCon.query(sql, [siteNumber, 'Closed'], function (err, result) {
      if (err) {
        console.log("removeSite.js: procedure remove_site failed");
        throw err;
      }

      if (result.length > 0) {
        console.log("removeSite.js: POST - site was removed successfully");
      }

      res.redirect('/removeSite?siteNumber=' + siteNumber);
    });
  } else if (siteStatus === "Closed") {
    sql = "CALL remove_site(?, ?);";
    dbCon.query(sql, [siteNumber, 'Active'], function (err, result) {
      if (err) {
        console.log("removeSite.js: procedure remove_site failed");
        throw err;
      }

      if (result.length > 0) {
        console.log("removeSite.js: POST - site was removed successfully");
      }

      res.redirect('/removeSite?siteNumber=' + siteNumber);
    });
  }
});


module.exports = router;
