var mysql = require('mysql');

var con = mysql.createConnection({
    host: "remotemysql.com",
    user: "4xv3ZUe5kc",
    password: "ooRAVaHThw"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected to mysql");
});

