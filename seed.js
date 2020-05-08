var mysql = require("mysql");
var creds = require("./creds.json");
var fs = require('fs');
var readline = require('readline');
const path = require("path");

var connection = mysql.createConnection({
    host: creds.host,

    // Your port; if not 3306
    port: creds.port,

    // Your username
    user: creds.user,

    // Your password
    password: creds.pw,
    // database: creds.database
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    seedDatabase();
});

function seedDatabase() {
    console.log("seeding database...\n");
    var dropDbQuery = `DROP DATABASE IF EXISTS ` + creds.database + `;`

    var query = connection.query(
        dropDbQuery,
        function (err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " database created!\n");
            createDb();
        }
    );
    var createDbQuery = `
    CREATE DATABASE ` + creds.database + `;`
    function createDb() {
        var query = connection.query(
            createDbQuery,
            function (err, res) {
                if (err) throw err;
                console.log(res.affectedRows + " database created!\n");
                runSeed();
            }
        );
    }

    function runSeed() {
        connection = mysql.createConnection({
            host: creds.host,

            // Your port; if not 3306
            port: creds.port,

            // Your username
            user: creds.user,

            // Your password
            password: creds.pw,
            database: creds.database
        });
        var seederSql = [];
        var seederLine = 0;
        var sqlPath = path.resolve(__dirname, "GreatBay.sql");
        fs.readFile(sqlPath, 'utf8', function (err, data) {
            if (err) {
                return console.log(err);
            }
            console.log(data)
            seederSql = data.split(";")
            console.log(seederSql)

            seederRunner();

        });
        function seederRunner() {
            var sql = seederSql[seederLine] + ";"
            if (sql != ";") {
                console.log(sql);

                connection.query(sql, function (err, res) {
                    if (err) console.log(err);
                    if (res)
                        console.log(res.affectedRows + " seeder run!\n");
                    if (seederLine < seederSql.length) {
                        seederLine++
                        seederRunner()
                    } else {
                        // exit();
                        console.log("::seeder done::")
                        process.exit()
                    }
                });
            } else {
                console.log("::seeder done- empty statement::")
                process.exit()
            }
        }
    }

}