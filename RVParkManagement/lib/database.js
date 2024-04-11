let mysql = require('mysql2');

var dbConnectionInfo = require('./connectionInfo');

var con = mysql.createConnection({
  host: dbConnectionInfo.host,
  user: dbConnectionInfo.user,
  password: dbConnectionInfo.password,
  port: dbConnectionInfo.port,
  multipleStatements: true              // Needed for stored proecures with OUT results
});

con.connect(function(err) {
  if (err) {
    throw err;
  }
  else {
    console.log("database.js: Connected to server!");
    
    con.query("CREATE DATABASE IF NOT EXISTS RVPark", function (err, result) {
      if (err) {
        console.log(err.message);
        throw err;
      }
      console.log("database.js: RVPark database created if it didn't exist");
      selectDatabase();
    });
  }
});

function selectDatabase() {
    let sql = "USE RVPark";
    con.query(sql, function(err, results, fields) {
      if (err) {
        console.log(err.message);
        throw err;
      } else {
        console.log("database.js: Selected RVPark database");
        //createTables();
        //createStoredProcedures();
        //addTableData();
        //addDummyData();
      }
    });
}

function addDummyData(){

    //5 users
    // "IN  username VARCHAR(255), \n" +
    // "IN  password VARCHAR(255), \n" +
    // "IN  firstName VARCHAR(255), \n" +
    // "IN  lastName VARCHAR(255), \n" +
    // "IN  phoneNumber INT, \n" +
    // "IN  account_number INT, \n" +
    sql = "CALL create_user('john.krasinski', 'jk12345', 'John', 'Krasinski', '555-555-5555', '18375960', @result)";
    con.query(sql, function(err,rows){
      if (err) {
        console.log(err.message);
        throw err;
      }
      console.log("database.js: Added user to users table");
    });
  }

  module.exports = con;