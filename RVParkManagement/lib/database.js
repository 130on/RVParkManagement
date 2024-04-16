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
        createTables();
        //createStoredProcedures();
        //addTableData();
        //addDummyData();
      }
    });
}

function createTables() {
  //Resets everything so I dont have to do it manually, we will comment this out later
  // let sql = "DROP DATABASE rvpark"
  // con.execute(sql, function(err, results, fields) {
  //   if (err) {
  //     console.log(err.message);
  //     throw err;
  //   } else {
  //     console.log("database.js: user types created if it didn't exist");
  //   }
  // }); 

  // sql = "DROP DATABASE nodeexpresssessionstorage"
  // con.execute(sql, function(err, results, fields) {
  //   if (err) {
  //     console.log(err.message);
  //     throw err;
  //   } else {
  //     console.log("database.js: user types created if it didn't exist");
  //   }
  // }); 


    sql = "CREATE TABLE IF NOT EXISTS user_types (\n" +
              "user_type_id INT NOT NULL AUTO_INCREMENT, \n" +
              "user_type VARCHAR(25) NOT NULL,\n" +
              "PRIMARY KEY (user_type_id)\n" +
              ")";
    con.execute(sql, function(err, results, fields) {
      if (err) {
        console.log(err.message);
        throw err;
      } else {
        console.log("database.js: user types created if it didn't exist");
      }
    }); 

    //We can make tables to pull from for Rank, DOD_Affiliation, and DOD_Status later, to avoid inconsistent data
    sql = "CREATE TABLE IF NOT EXISTS users (\n" +
                "email VARCHAR(255) NOT NULL,\n" +
                "hashed_password VARCHAR(255) NOT NULL,\n" +
                "salt VARCHAR(255) NOT NULL,\n" +
                "firstName VARCHAR(255) NOT NULL,\n" +
                "lastName VARCHAR(255) NOT NULL,\n" +
                "phoneNumber VARCHAR(40),\n" +
                "military_rank VARCHAR(255) NOT NULL,\n" +
                "dod_affiliation VARCHAR(255) NOT NULL,\n" +
                "dod_status VARCHAR(25) NOT NULL,\n" +
                "user_role_id INT NOT NULL, \n" +
                "FOREIGN KEY (user_role_id) REFERENCES user_types(user_type_id),\n" +
                "PRIMARY KEY (email)\n" +
              ");";
    con.execute(sql, function(err, results, fields) {
      if (err) {
        console.log(err.message);
        throw err;
      } else {
        console.log("database.js: table users created if it didn't exist");
      }
    });

    //Like RV Parking or Tent Reservation
    sql = "CREATE TABLE IF NOT EXISTS reservation_types (\n" +
                "reservation_type_id INT NOT NULL AUTO_INCREMENT, \n" +
                "reservation_type VARCHAR(45) NOT NULL,\n" +
                "PRIMARY KEY (reservation_type_id)\n" +
              ");";
    con.execute(sql, function(err, results, fields) {
      if (err) {
        console.log(err.message);
        throw err;
      } else {
        console.log("database.js: table reservation_types created if it didn't exist");
      }
    });

        sql = "CREATE TABLE IF NOT EXISTS reservations (\n" +
                "reservation_id INT(12) ZEROFILL NOT NULL AUTO_INCREMENT,\n" +
                "email VARCHAR(255) NOT NULL,\n" +
                "rv_size DECIMAL(5,2) NOT NULL, \n" +
                "site_id INT NOT NULL, \n" +
                "date_of_reservation DATE NOT NULL, \n" +
                "from_date DATE NOT NULL, \n" +
                "to_date DATE NOT NULL, \n" +
                "reservation_status varchar(45) NOT NULL, \n" +
                "reservation_type_id INT NOT NULL, \n" +
                "PRIMARY KEY (reservation_id), \n" +
                "FOREIGN KEY (email) REFERENCES users(email),\n" +
                "FOREIGN KEY (reservation_type_id) REFERENCES reservation_types(reservation_type_id)\n" +
              ")";
    con.execute(sql, function(err, results, fields) {
      if (err) {
        console.log(err.message);
        throw err;
      } else {
        console.log("database.js: reservations created if it didn't exist");
      }
    }); 

        sql = "CREATE TABLE IF NOT EXISTS payments (\n" +
            "payment_id INT NOT NULL AUTO_INCREMENT,\n" +
            "card_number INT(12) NOT NULL, \n" +
            "amount DECIMAL(15,2) NOT NULL, \n" +
            "payment_date DATE NOT NULL, \n" +
            "reason VARCHAR(45) NOT NULL, \n" +
            "email VARCHAR(255) NOT NULL, \n" +
            "PRIMARY KEY (payment_id) \n" +
          ")";
    con.execute(sql, function(err, results, fields) {
      if (err) {
        console.log(err.message);
        throw err;
    } else {
      console.log("database.js: payments created if it didn't exist");
    }
    }); 

        sql = "CREATE TABLE IF NOT EXISTS sites (\n" +
            "site_id INT NOT NULL,\n" +
            "reservation_type_id INT NOT NULL, \n" +
            "hookups BOOL NOT NULL, \n" +
            "PRIMARY KEY (site_id), \n" +
            "FOREIGN KEY (reservation_type_id) REFERENCES reservation_types(reservation_type_id)\n" +
          ")";
    con.execute(sql, function(err, results, fields) {
      if (err) {
        console.log(err.message);
        throw err;
    } else {
      console.log("database.js: payments created if it didn't exist");
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