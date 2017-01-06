// CALLING THE PACKAGES
var express = require("express");
var app = express();
var path = require("path");
var port = process.env.PORT || 8080;

//set the public folder to server public assests
app.use(express.static(__dirname + '/public'));

//set up our one route to the index.html file
app.get('*',function(req,res){
    
    res.sendFile(path.join(__dirname + '/public-1/views/pages/index.html'));
});

//start the server on port
app.listen(port);
console.log('Magic happens at port ' + port);

