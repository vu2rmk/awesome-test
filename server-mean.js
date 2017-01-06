//Pulling all the packages...
/// BASE SETUP
var express = require("express");
var app = express();
var morgan = require("morgan");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var jwt = require('jsonwebtoken');
var port = process.env.port || 8080;

var User = require('./models/user.js');

var config = require("./config.js");

mongoose.connect(config.database);


//API Routes -------------------------------------
var apiRoutes = require("./app/routes/api")(app,express);
app.use('/api',apiRoutes);

//START the server
app.listen(config.port);

console.log('Magic happens at ' + config.port);