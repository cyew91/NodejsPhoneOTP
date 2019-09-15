require('dotenv').config();
const util = require('util');
const {
    MYSQL_URL,
    MYSQL_PORT,
    MYSQL_DBUSER,
    MYSQL_DBPWD,
    MYSQL_DEFAULT_DB
} = process.env;

const mySql = require('mysql');

const dbConnPool = mySql.createConnection({
    connectionLimit : 10,
    host     : MYSQL_URL,
    port     : MYSQL_PORT,
    user     : MYSQL_DBUSER,
    password : MYSQL_DBPWD,
    database : MYSQL_DEFAULT_DB
});

// connect to database
dbConnPool.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});

dbConnPool.on('acquire', function (connection) {
    console.log('Connection %d acquired', connection.threadId);
});

dbConnPool.on('release', function (connection) {
    console.log('Connection %d released', connection.threadId);
});

dbConnPool.query = util.promisify(dbConnPool.query);

module.exports = {
    mySql, dbConnPool
};