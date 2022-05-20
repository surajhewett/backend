var express = require('express');
var connection = require('./config/database.js');
var bodyParser = require("body-parser");
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
  req.connection = connection
  next()
})

app.use(express.urlencoded());

const authRouter = require("./routes/routes");

app.use("/", authRouter);

let port = process.env.PORT || 8000;
app.listen(port, function () {
  return console.log("Started user authentication server listening on port " + port);
});
