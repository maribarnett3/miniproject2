// ===============================================================================
// LOAD DATA
// We are linking our routes to a series of "data" sources.
// These data sources hold arrays of information on table-data, waitinglist, etc.
// ===============================================================================


const fs = require("fs");
const path = require("path");
const OUTPUT_DIR = path.resolve(__dirname, "../db");
const outputPath = path.join(OUTPUT_DIR, "db.json");
var mysql = require("mysql");
var creds = require("../creds.json");



// define connection to the database
var connection = mysql.createConnection({
    host: creds.host,

    // Your port; if not 3306
    port: creds.port,

    // Your username
    user: creds.user,

    // Your password
    password: creds.pw,
    database: creds.database
});
//   notesData = []
// ===============================================================================
// ROUTING
// ===============================================================================

module.exports = function (app) {
  // API GET Requests
  // Below code handles when users "visit" a page.
  // In each of the below cases when a user visits a link
  // (ex: localhost:PORT/api/admin... they are shown a JSON of the data in the table)
  // ---------------------------------------------------------------------------

  app.get("/api/notes", function (req, res) {
    let responseData = JSON.parse(JSON.stringify(notesData))
    for (let i = 0; i < responseData.length; i++) {
      responseData[i].id = i;

    }
    res.json(responseData);
  });


  // API POST Requests
  // Below code handles when a user submits a form and thus submits data to the server.
  // In each of the below cases, when a user submits form data (a JSON object)
  // ...the JSON is pushed to the appropriate JavaScript array
  // (ex. User fills out a reservation request... this data is then sent to the server...
  // Then the server saves the data to the tableData array)
  // ---------------------------------------------------------------------------

  app.post("/api/notes", function (req, res) {
    // Note the code here. Our "server" will respond to requests and let users know if they have a table or not.
    // It will do this by sending out the value "true" have a table
    // req.body is available since we're using the body parsing middleware
    if (!notesData || notesData.length < 1) {
      notesData = [req.body];
    }
    else {
      notesData.push(req.body);

    }
    console.log(notesData)
    fs.writeFileSync(outputPath, JSON.stringify(notesData), err => {
      console.log(err)
    })
    res.json(true);
  });

  // ---------------------------------------------------------------------------
  // I added this below code so you could clear out the table while working with the functionality.
  // Don"t worry about it!

  app.delete("/api/notes/:id", function (req, res) {
    const id = req.params.id
   
    if (notesData[id])
      notesData.splice(id, 1)

    fs.writeFile(outputPath, JSON.stringify(notesData), err => {
      // console.log(err)
    })

    res.json({ ok: true });
  });
};
