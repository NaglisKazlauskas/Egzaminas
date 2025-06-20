const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    port: 4306, // Change this to your MySQL port if different
    password: '',
    database: 'cityevents'
});

module.exports = pool.promise();