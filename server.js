var server = require('http');
var express = require('express');

var port = 5000;

var app = express();

server.createServer(app).listen(port);

app.get('/', function(req, resp){
	
	resp.send(new Date().toISOString() + ' Hello');
})

// server.listen(port);

// console.log("Server listening on port " + port);
