var server = require('http');
var express = require('express');
var exec = require('child_process').exec;

var _getCurrentCPU = "top -bn 2 -d 0.01 | grep '^%Cpu' | tail -n 1 | gawk '{print $2+$4+$6}'";
var _getTotalRAM = "cat /proc/meminfo | grep MemTotal | awk '{print $2 \" \" $3}'";
var _getFreeRAM = "cat /proc/meminfo | grep MemFree | awk '{print $2 \" \" $3}'";
var _getUsedRAM = "expr $(cat /proc/meminfo | grep MemTotal | awk '{print $2}') - $(cat /proc/meminfo | grep MemFree | awk '{print $2}')";

var port = 5000;

var app = express();

server.createServer(app).listen(port);

app.get('/cpu', function(req, resp){
	
	getCPU(function(_CPU){
			
			resp.write(_CPU.toString(), function(){
				
				resp.end();
			});
		});
})

app.get('/total_ram', function(req, resp){
	
	getTotalRAM(function(_totalRAM){
			
			resp.write(_totalRAM.toString(), function(){
				
				resp.end();
			});
		});
})

app.get('/free_ram', function(req, resp){
	
	getFreeRAM(function(_freeRAM){
			
			resp.write(_freeRAM.toString(), function(){
				
				resp.end();
			});
		});
})

app.get('/used_ram', function(req, resp){
	
	getUsedRAM(function(_usedRAM){
			
			resp.write(_usedRAM.toString(), function(){
				
				resp.end();
			});
		});
})

function getCPU(next){
	
	exec(_getCurrentCPU, function(err, stderr, stdout){
		
		if (!err){
			
			next(stderr);
			next(stdout);
		} else {
			
			next(err);
		}
	});
}

function getTotalRAM(next){
	
	exec(_getTotalRAM, function(err, stderr, stdout){
		
		if (!err){
			
			next(stderr);
			next(stdout);
		} else {
			
			next(err);
		}
	});
}

function getFreeRAM(next){
	
	exec(_getFreeRAM, function(err, stderr, stdout){
		
		if (!err){
			
			next(stderr);
			next(stdout);
		} else {
			
			next(err);
		}
	});
}

function getUsedRAM(next){
	
	exec(_getUsedRAM, function(err, stderr, stdout){
		
		if (!err){
			
			next(stderr);
			next(stdout);
		} else {
			
			next(err);
		}
	});
}