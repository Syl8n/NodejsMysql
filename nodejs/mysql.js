var mysql      = require('mysql2');
var config  = require('../config/env/mysql');

var connection = mysql.createConnection({
  host     : `${config.host}`,
  user     : `${config.user}`,
  password : `${config.password}`,
  database : `${config.database}`
});
  
module.exports = connection;