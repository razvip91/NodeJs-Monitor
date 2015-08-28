var server = require('http');
var fs = require('fs');
var elasticsearch = require('elasticsearch');
var Q = require('q');
var uuid = require('node-uuid');
var client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});

var port = 5001;

server.createServer().listen(port);

setInterval(getCPU, 3000);
// setInterval(getTotalRAM, 3000);
setInterval(getUsedRam, 3000);
setInterval(getFreeRam, 3000);
setInterval(getRXTraffic, 3000);
setInterval(getTXTraffic, 3000);

// getCPU();

function getCPU(){
	var index = 'cpu';
	server.get("http://localhost:5000/cpu", function(res) {
		var writeStream = fs.createWriteStream('./output/cpu.txt', { flags : 'a', encoding : null, fd : null, mode : 0666 });
		  // This pipes the GET data to the file
		res.on("data", function(chunk) {
    		// console.log("BODY: " + chunk);
    			insertData(index, chunk);
		})

		res.pipe(writeStream, function(err){ 
			if (!err){	  
				console.log("Data written successfull!");				
			} else {	  
				console.log(err);
			}
		});
	}).on('error', function(e) {
		console.log("Got error: " + e.message);
	})
}

function getTotalRAM(){
	
	server.get("http://localhost:5000/total_ram", function(res) {
		var writeStream = fs.createWriteStream('./output/total_ram.txt', { flags : 'a', encoding : null, fd : null, mode : 0666 });
		  // This pipes the GET data to the file
		res.on("data", function(chunk) {
    		// console.log("BODY: " + chunk);
    			insertData(index, chunk);
		})
		res.pipe(writeStream, function(err){ 
			if (!err){	  
				console.log("Data written successfull!");
				// writeStream.end();
				getUsedRam();
			} else {	  
				console.log(err);
			}
		});
	}).on('error', function(e) {
		console.log("Got error: " + e.message);
	})
}

function getUsedRam(){
	var index = 'used_ram';
	server.get("http://localhost:5000/used_ram", function(res) {
		var writeStream = fs.createWriteStream('./output/used_ram.txt', { flags : 'a', encoding : null, fd : null, mode : 0666 });
		  // This pipes the GET data to the file
		res.on("data", function(chunk) {
    		// console.log("BODY: " + chunk);
    			insertData(index, chunk);
		})
		res.pipe(writeStream, function(err){ 
			if (!err){	  
				console.log("Data written successfull!");
				// writeStream.end();
				getFreeRam();
			} else {	  
				console.log(err);
			}
		});
	}).on('error', function(e) {
		console.log("Got error: " + e.message);
	})
}

function getFreeRam(){
	var index = 'free_ram';
	server.get("http://localhost:5000/free_ram", function(res) {
		var writeStream = fs.createWriteStream('./output/free_ram.txt', { flags : 'a', encoding : null, fd : null, mode : 0666 });
		  // This pipes the GET data to the file
		res.on("data", function(chunk) {
    		// console.log("BODY: " + chunk);
    			insertData(index, chunk);
		})
		res.pipe(writeStream, function(err){ 
			if (!err){	  
				console.log("Data written successfull!");
				// writeStream.end();
				getRXTraffic();
			} else {	  
				console.log(err);
			}
		});
	}).on('error', function(e) {
		console.log("Got error: " + e.message);
	})
}

function getRXTraffic(){
	var index = 'net_rx';
	server.get("http://localhost:5000/net_rx", function(res) {
		var writeStream = fs.createWriteStream('./output/net_rx.txt', { flags : 'a', encoding : null, fd : null, mode : 0666 });
		  // This pipes the GET data to the file
		res.on("data", function(chunk) {
    		// console.log("BODY: " + chunk);
    			insertData(index, chunk);
		})
		res.pipe(writeStream, function(err){ 
			if (!err){	  
				console.log("Data written successfull!");
				// writeStream.end();
				getTXTraffic();
			} else {	  
				console.log(err);
			}
		});
	}).on('error', function(e) {
		console.log("Got error: " + e.message);
	})
}

function getTXTraffic(){
	var index = 'net_tx';
	server.get("http://localhost:5000/net_tx", function(res) {
		var writeStream = fs.createWriteStream('./output/net_tx.txt', { flags : 'a', encoding : null, fd : null, mode : 0666 });
		  // This pipes the GET data to the file
		res.on("data", function(chunk) {
    		// console.log("BODY: " + chunk);
    			insertData(index, chunk);
		})
		res.pipe(writeStream, function(err){ 
			if (!err){	  
				console.log("Data written successfull!");
				// writeStream.end();
				// getCPU();
			} else {	  
				console.log(err);
			}
		});
	}).on('error', function(e) {
		console.log("Got error: " + e.message);
	})
}

function insertData(index, data){
	var def = Q.defer();
	var date = new Date()
	var date_string = date.toString();
	var uid = uuid.v1();
	var data_string = data.toString();
	data_string = data_string.replace(/(\r\n|\n|\r)/gm,"");
	var index = index;

	createDoc(index, data_string).then(function(response){ console.log(response); }).fail(function(error){ console.log(error); });

	function createDoc(index, data){
		client.create({
		  index: index,
		  type: 'integer',
		  id: uid,
		  body: {
		    value: data,
		    tags: ['data', 'monitor'],
		    published: true,
		    published_at: date_string,
		    counter: 1
		  }
		}, function (error, response) {
		  if(error)
		  		def.reject(new Error(error));
		  else 
		  		def.resolve(response);
		});
		return def.promise
	}
}
