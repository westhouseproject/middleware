/* jshint node:true */

var mysql      = require('mysql'),
    connection = mysql.createConnection({
      host     : 'localhost',
      user     : 'root',
      password : 'root'
    });

connection.connect();

