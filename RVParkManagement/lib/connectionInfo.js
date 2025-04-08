// var connectionInfo = {
//   host: "***.*.*.*",
//   port: ****,
//   user: "******",
//   password: "********"
// };

// module.exports = connectionInfo;


const connectionInfo = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT,
  user: process.env.DB_USER || 'your_default_user',
  password: process.env.DB_PASSWORD || 'your_default_password',
  // database: process.env.DB_NAME || 'your_db_name'
};

module.exports = connectionInfo;
