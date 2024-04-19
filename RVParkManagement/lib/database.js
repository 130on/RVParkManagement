let mysql = require('mysql2');

var dbConnectionInfo = require('./connectionInfo');

var con = mysql.createConnection({
  host: dbConnectionInfo.host,
  user: dbConnectionInfo.user,
  password: dbConnectionInfo.password,
  port: dbConnectionInfo.port,
  multipleStatements: true              // Needed for stored proecures with OUT results
});

con.connect(function (err) {
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
  con.query(sql, function (err, results, fields) {
    if (err) {
      console.log(err.message);
      throw err;
    } else {
      console.log("database.js: Selected RVPark database");
      createTables();
      createStoredProcedures();
      //addTableData();
      addDummyData();
    }
  });
}

function createTables() {
  //Resets everything so I dont have to do it manually, we will comment this out later
  // let sql = "DROP DATABASE rvpark"
  // con.execute(sql, function (err, results, fields) {
  //   if (err) {
  //     console.log(err.message);
  //     throw err;
  //   } else {
  //     console.log("database.js: user types created if it didn't exist");
  //   }
  // });

  // sql = "DROP DATABASE nodeexpresssessionstorage"
  // con.execute(sql, function (err, results, fields) {
  //   if (err) {
  //     console.log(err.message);
  //     throw err;
  //   } else {
  //     console.log("database.js: user types created if it didn't exist");
  //   }
  // });


  let sql = "CREATE TABLE IF NOT EXISTS user_types (\n" +
    "user_type_id INT NOT NULL AUTO_INCREMENT, \n" +
    "user_type VARCHAR(25) NOT NULL,\n" +
    "PRIMARY KEY (user_type_id)\n" +
    ")";
  con.execute(sql, function (err, results, fields) {
    if (err) {
      console.log(err.message);
      throw err;
    } else {
      console.log("database.js: table user types created if it didn't exist");
    }
  });

  //We can make tables to pull from for Rank, DOD_Affiliation, and DOD_Status later, to avoid inconsistent data
  sql = "CREATE TABLE IF NOT EXISTS users (\n" +
    "user_id INT(6) ZEROFILL NOT NULL AUTO_INCREMENT,\n" +
    "username varchar(45) NOT NULL,\n" +
    "first_name VARCHAR(255) NOT NULL,\n" +
    "last_name VARCHAR(255) NOT NULL,\n" +
    "email VARCHAR(255) NOT NULL,\n" +
    "phone_number VARCHAR(40),\n" +
    "hashed_password VARCHAR(255) NOT NULL,\n" +
    "salt VARCHAR(255) NOT NULL,\n" +
    "street_address VARCHAR(40),\n" +
    "city VARCHAR(40),\n" +
    "state VARCHAR(30),\n" +
    "zip VARCHAR(10),\n" +
    "dod_affiliation VARCHAR(45) NOT NULL,\n" +
    "dod_status VARCHAR(45) NOT NULL,\n" +
    "military_rank VARCHAR(45),\n" +
    "user_role_id INT NOT NULL, \n" +
    "FOREIGN KEY (user_role_id) REFERENCES user_types(user_type_id),\n" +
    "PRIMARY KEY (user_id)\n" +
    ");";
  con.execute(sql, function (err, results, fields) {
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
    "reservation_type_description VARCHAR(255), \n" +
    "PRIMARY KEY (reservation_type_id)\n" +
    ");";
  con.execute(sql, function (err, results, fields) {
    if (err) {
      console.log(err.message);
      throw err;
    } else {
      console.log("database.js: table reservation_types created if it didn't exist");
    }
  });


  sql = "CREATE TABLE IF NOT EXISTS sites (\n" +
    "site_id INT NOT NULL AUTO_INCREMENT,\n" +
    "site_number INT NOT NULL,\n" +
    "max_size int, \n" +
    "price_per_night INT NOT NULL, \n" +
    "site_status VARCHAR(45) NOT NULL, \n" +
    "reservation_type_id INT NOT NULL, \n" +
    "PRIMARY KEY (site_id), \n" +
    "FOREIGN KEY (reservation_type_id) REFERENCES reservation_types(reservation_type_id)\n" +
    ")";
  con.execute(sql, function (err, results, fields) {
    if (err) {
      console.log(err.message);
      throw err;
    } else {
      console.log("database.js: table sites created if it didn't exist");
    }
  });


  sql = "CREATE TABLE IF NOT EXISTS managing_sites_log (\n" +
    "log_id INT NOT NULL AUTO_INCREMENT,\n" +
    "user_id INT(6) ZEROFILL NOT NULL, \n" +
    "site_id INT NOT NULL, \n" +
    "log_date date NOT NULL, \n" +
    "note VARCHAR(255), \n" +
    "PRIMARY KEY (log_id), \n" +
    "FOREIGN KEY (user_id) REFERENCES users(user_id),\n" +
    "FOREIGN KEY (site_id) REFERENCES sites(site_id)\n" +
    ")";
  con.execute(sql, function (err, results, fields) {
    if (err) {
      console.log(err.message);
      throw err;
    } else {
      console.log("database.js: table managing_sites_log created if it didn't exist");
    }
  });

  sql = "CREATE TABLE IF NOT EXISTS payments (\n" +
    "payment_id INT NOT NULL AUTO_INCREMENT,\n" +
    "card_number INT(12) NOT NULL, \n" +
    "amount DECIMAL(15,2) NOT NULL, \n" +
    "payment_date DATE NOT NULL, \n" +
    "payment_status VARCHAR(45) NOT NULL, \n" +
    "reason VARCHAR(45) NOT NULL, \n" +
    "user_id INT(6) ZEROFILL NOT NULL, \n" +
    "PRIMARY KEY (payment_id), \n" +
    "FOREIGN KEY (user_id) REFERENCES users(user_id)\n" +
    ")";
  con.execute(sql, function (err, results, fields) {
    if (err) {
      console.log(err.message);
      throw err;
    } else {
      console.log("database.js: table payments created if it didn't exist");
    }
  });

  sql = "CREATE TABLE IF NOT EXISTS reservations (\n" +
    "reservation_id INT NOT NULL AUTO_INCREMENT,\n" +
    "user_id INT(6) ZEROFILL NOT NULL,\n" +
    "reservation_type_id INT NOT NULL, \n" +
    "site_id INT NOT NULL, \n" +
    "payment_id INT NOT NULL, \n" +
    "rv_size DECIMAL(5,2), \n" +
    "date_of_reservation DATE NOT NULL, \n" +
    "reservation_status VARCHAR(45) NOT NULL, \n" +
    "from_date DATE NOT NULL, \n" +
    "to_date DATE NOT NULL, \n" +
    "PRIMARY KEY (reservation_id), \n" +
    "FOREIGN KEY (user_id) REFERENCES users(user_id),\n" +
    "FOREIGN KEY (reservation_type_id) REFERENCES reservation_types(reservation_type_id),\n" +
    "FOREIGN KEY (site_id) REFERENCES sites(site_id),\n" +
    "FOREIGN KEY (payment_id) REFERENCES payments(payment_id)\n" +
    ")";
  con.execute(sql, function (err, results, fields) {
    if (err) {
      console.log(err.message);
      throw err;
    } else {
      console.log("database.js: table reservations created if it didn't exist");
    }
  });

}

function createStoredProcedures() {

  let sql =
    "CREATE PROCEDURE IF NOT EXISTS `register_user`(\n" +
    "IN newUsername VARCHAR(45),\n" +
    "IN newFirstName VARCHAR(255),\n" +
    "IN newLastName VARCHAR(255),\n" +
    "IN newEmail VARCHAR(255),\n" +
    "IN newPhoneNumber VARCHAR(40),\n" +
    "IN newHashedPassword VARCHAR(255),\n" +
    "IN newSalt VARCHAR(255),\n" +
    "IN newStreetAddress VARCHAR(40),\n" +
    "IN newCity VARCHAR(40),\n" +
    "IN newState VARCHAR(30),\n" +
    "IN newZIP VARCHAR(10),\n" +
    "IN newDodAffiliation VARCHAR(255),\n" +
    "IN newDodStatus VARCHAR(25),\n" +
    "IN newRank VARCHAR(40),\n" +
    "IN newUserRoleId VARCHAR(50),\n" +
    "OUT result INT\n" +
    ")\n" +
    "BEGIN\n" +
    "DECLARE userCount INT;\n" +
    "SET result = 0;\n" +
    "SELECT COUNT(*) INTO userCount\n" +
    "FROM users\n" +
    "WHERE email = newEmail\n" +
    "OR username = newUserName;\n" +
    "IF userCount = 0\n" +
    "THEN \n" +
    "INSERT INTO users (username, first_name, last_name, email, phone_number, hashed_password, salt, street_address, city, state, zip, dod_affiliation, dod_status, military_rank, user_role_id)\n" +
    "VALUES (newUsername, newFirstName, newLastName, newEmail, newPhoneNumber, newHashedPassword, newSalt, newStreetAddress, newCity, newState, newZIP, newDodAffiliation, newDodStatus, newRank," +
    "(SELECT user_type_id FROM user_types WHERE user_types.user_type = newUserRoleId LIMIT 1));\n" +
    "ELSE\n" +
    "SET result = 1;\n" +
    "END IF;\n" +
    "END;";
  con.query(sql, function (err, results, fields) {
    if (err) {
      console.log(err.message);
      throw err;
    } else {
      console.log("database.js: procedure register_user created if it didn't exist");
    }
  });

  sql = "CREATE PROCEDURE IF NOT EXISTS `get_salt`(\n" +
    "IN username VARCHAR(255)\n" +
    ")\n" +
    "BEGIN\n" +
    "SELECT salt FROM users\n" +
    "WHERE users.username = username\n" +
    "LIMIT 1;\n" +
    "END;";
  con.query(sql, function (err, results, fields) {
    if (err) {
      console.log(err.message);
      throw err;
    } else {
      console.log("database.js: procedure get_salt created if it didn't exist");
    }
  });


  sql = "CREATE PROCEDURE IF NOT EXISTS `check_credentials`(\n" +
    "IN username VARCHAR(255),\n" +
    "IN hashed_password VARCHAR(255)\n" +
    ")\n" +
    "BEGIN\n" +
    "SELECT EXISTS(\n" +
    "SELECT * FROM users\n" +
    "WHERE users.username = username AND users.hashed_password = hashed_password\n" +
    ") AS result;\n" +
    "END;";

  con.query(sql, function (err, results, fields) {
    if (err) {
      console.log(err.message);
      throw err;
    } else {
      console.log("database.js: procedure check_credentials created if it didn't exist");
    }
  });

  sql = "CREATE PROCEDURE IF NOT EXISTS `change_password`(\n" +
    "IN username VARCHAR(255),\n" +
    "IN new_password_hash VARCHAR(255),\n" +
    "IN new_password_salt VARCHAR(255)\n" +
    ")\n" +
    "BEGIN\n" +
    "UPDATE users SET users.hashed_password = new_password_hash WHERE users.username = username;\n" +
    "UPDATE users SET users.salt = new_password_salt WHERE users.username = username;\n" +
    "END;";

  con.query(sql, function (err, results, fields) {
    if (err) {
      console.log(err.message);
      throw err;
    } else {
      console.log("database.js: procedure change_password created if it didn't exist");
    }
  });


  sql = "CREATE PROCEDURE IF NOT EXISTS `insert_user_type`(\n" +
    "IN user_type VARCHAR(45)\n" +
    ")\n" +
    "BEGIN\n" +
    "INSERT INTO user_types (user_type)\n" +
    "SELECT user_type FROM DUAL\n" +
    "WHERE NOT EXISTS (\n" +
    "SELECT * FROM user_types\n" +
    "WHERE user_types.user_type=user_type LIMIT 1\n" +
    ");\n" +
    "END;";
  con.query(sql, function (err, results, fields) {
    if (err) {
      console.log(err.message);
      throw err;
    } else {
      console.log("database.js: procedure insert_user_type created if it didn't exist");
    }
  });
}

function addDummyData() {


  // sql = "CALL register('john.krasinski', 'jk12345', 'John', 'Krasinski', '555-555-5555', '18375960', @result)";
  // con.query(sql, function (err, rows) {
  //   if (err) {
  //     console.log(err.message);
  //     throw err;
  //   }
  //   console.log("database.js: Added user to users table");
  // });

  sql = "CALL insert_user_type('customer')";
  con.query(sql, function (err, rows) {
    if (err) {
      console.log(err.message);
      throw err;
    }
    console.log("database.js: Added 'customer' to user_types");
  });

  sql = "CALL insert_user_type('admin')";
  con.query(sql, function (err, rows) {
    if (err) {
      console.log(err.message);
      throw err;
    }
    console.log("database.js: Added 'admin' to user_types");
  });

  sql = "CALL insert_user_type('employee')";
  con.query(sql, function (err, rows) {
    if (err) {
      console.log(err.message);
      throw err;
    }
    console.log("database.js: Added 'employee' to user_types");
  });
}

module.exports = con;