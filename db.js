const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'homehelper'
});

connection.connect((err) => {
    if (err) throw err;
    console.log("Conectado ao banco de dados MysQL");
})

module.exports = connection;