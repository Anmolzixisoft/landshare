const mysql = require('mysql');

const connection = mysql.createConnection({
  host:process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  port: process.env.DB_PORT
});

// Connect to MySQL
connection.connect((err) => {

  if (err) {
    console.error('Error connecting to MySQL:--------', err.message);
    return;
  }
  console.log('Connected to MySQL');
});

module.exports = connection;