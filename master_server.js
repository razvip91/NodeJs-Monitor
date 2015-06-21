var server = require('http');
var fs = require('fs');


var port = 5001;

server.createServer().listen(port);

setInterval(getCPU, 3000);

function getCPU(){
	
	server.get("http://192.168.0.2:5000/cpu", function(res) {
	
		var writeStream = fs.createWriteStream('./output.txt', { flags : 'a', encoding : null, fd : null, mode : 0666 });

		  // This pipes the GET data to the file
		res.pipe(writeStream, function(err){
			  
			if (!err){
				  
				console.log("Data written successfull!");
				// writeStream.end();
			} else {
				  
				console.log(err);
			}
		});
	}).on('error', function(e) {
	
		console.log("Got error: " + e.message);
	})
}