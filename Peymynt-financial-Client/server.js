var express = require('express');
var router = express.Router();
var app = express();
const path = require("path");

app.use(express.static(__dirname + '/dist'));

// Redirect 404 to index to let react router decide the page to show
var indexPage = path.join(__dirname, "./dist/index.html");
app.get('*', function (req, res) {
    res.status(404).sendFile(indexPage);
});
const port = process.env.PORT || 3000;
app.listen(port);
console.log('working on ' + port);
