const mysql = require("mysql");
const dbConfig = require("../config/db.config.js");
const dotenv = require('dotenv').config();
// Create a connection to the database
console.log(dbConfig.HOST);
const connection = mysql.createPool({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB
});
connection.query('select 1 + 1', (err, rows) => {
  if (err) {
    throw err;
  }
  console.log("Successfully connected to the database.");

  /* */
});

// open the MySQL connection
// connection.connect(error => {
//   if (error) throw error;

//   console.log("Successfully connected to the database.");
// });

module.exports = connection;