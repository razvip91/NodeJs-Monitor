var server = require('http');
var express = require('express');
var exec = require('child_process').exec;

var _getCurrentCPU = "top -bn 1 | awk '{print $9}' | tail -n +8 | awk '{s+=$1} END {print s}'";
var _getTotalRAM = "cat /proc/meminfo | grep MemTotal | awk '{print $2 \" \" $3}'";
var _getFreeRAM = "cat /proc/meminfo | grep MemFree | awk '{print $2 \" \" $3}'";
var _getUsedRAM = "expr $(cat /proc/meminfo | grep MemTotal | awk '{print $2}') - $(cat /proc/meminfo | grep MemFree | awk '{print $2}')";
var _getNetworkRX = "sh /home/razvan/work/NodeJs-Monitor/network_monitor_rx.sh wlan0";
var _getNetworkTX = "sh /home/razvan/work/NodeJs-Monitor/network_monitor_tx.sh wlan0";

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

app.get('/net_tx', function(req, resp){	
	getTXTraffic(function(tx_bytes){
			resp.write(tx_bytes.toString(), function(){
				resp.end();
			});
		});
})

app.get('/net_rx', function(req, resp){	
	getRXTraffic(function(rx_bytes){			
			resp.write(rx_bytes.toString(), function(){
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

function getRXTraffic(next){
	exec(_getNetworkRX, function(err, stderr, stdout){
		if (!err){
			next(stderr);
			next(stdout);
		} else {
			next(err);
		}
	});
}

function getTXTraffic(next){
	exec(_getNetworkTX, function(err, stderr, stdout){		
		if (!err){
			next(stderr);
			next(stdout);
		} else {
			next(err);
		}
	});
}
