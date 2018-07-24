var http = require('http');
var fs = require('fs');
//var MongoClient = require('mongodb').MongoClient;

var inuse = 0;

var settings = JSON.parse(fs.readFileSync('settings.json','utf-8'));

process.on('beforeExit', function(code) {
    console.log("Exit with code: " + code);
});

function URLpars ( url ) {
    var returnObject = {'path':''};
    var pointer = returnObject;
    var mode = 'path';
    var temp = '';
    for (var i=0; i < url.length; ++i) {
	if (url[i] === '?') {
	    returnObject['query'] = {};
	    mode = 'param';
       	}
	else if (url[i] === '+') { mode = 'param'; temp = ''; }
	else if (url[i] === '=') { mode = 'value'; }
	else if (mode === 'path') { returnObject['path'] += url[i]; }
	else if (mode === 'param') { temp += url[i] }
	else if (mode === 'value' && temp) { returnObject.query[temp] += url[i]; }
    }
    return returnObject;
}

http.createServer(function (req, res) {
    var URL = URLpars(req.url);
    var output = 'nothing';
    if (!URL.path || URL.path === '/index.html' || URL.path === '/' || URL.path === 'data') {
	res.writeHead(200, {'Content-Type': 'text/html'});
	console.log('serve client side app');
	fs.readFile("client_side_app.html", function (err, data) {
	    if (err) { throw err; }
	    res.write(data);
	    res.end();
	});
	fs.readFile;
    }
    else if (URL.path === "/templet" || URL.path === '/templet.csv') {
	res.writeHead(200,{'Content-Type': 'text'});
	console.log('serve templet');
	fs.readFile("templet.csv", function (err, data) {
	    if (err) { throw err; }
	    res.write(data);
	    res.end();
	});
	fs.readFile;
    }
    else if (URL.path === '/submitdata') {
	console.log('handle submitted data');
	res.writeHead(200, {'Content-Type': 'text/html'});
	var body = '';
	req.on('data', function (chunk) { body += chunk.toString(); } )
	req.on('end', function () {
	    console.log(body);
	    var data = JSON.parse(body);
	    if (data.length > 0) {
		console.log(data);
		while (inuse) { console.log("Waiting for databse");}
		inuse = 1;
		var database = JSON.parse(fs.readFileSync('database.json','utf-8'));
		var length = database.length;
		database = database.concat(data);
		fs.writeFileSync('database.json',JSON.stringify(database));
		inuse = 0;
		console.log("Inserted " + (database.length - length) + " documents");
		output = "Added " + (database.length - length) + " entries.";
		res.end(output);
	    }
	    else res.end('No entries recieved. May be due to format error.');
	});
    }
    else if (URL.path === "/updatedatabase") {
	console.log('handle update of data');
	res.writeHead(200, {'Content-Type': 'text/html'});
	var body = '';
	req.on('data', function (chunk) { body += chunk.toString(); } )
	req.on('end', function () {
	    var data = JSON.parse(body);
	    if (data.length > 0) {
		var n_updated=0;
		var no = 0;
		while (inuse) { console.log("Waiting for databse");}
		inuse = 1;
		var database = JSON.parse(fs.readFileSync('database.json','utf-8'));
	    	for (var i=0; i<data.length; ++i) {
		    if (data[i].accno) {
			for (var j=0; j<database.length; ++j) {
			    if (database[j].accno && data[i].accno === database[j].accno) {
				for (column in data[i]) {
				    if (data[i].hasOwnProperty(column)) {
					database[j][column] = data[i][column];
				    }
				}
				++n_updated;
			    }
			}
		    }
		}
		fs.writeFileSync('database.json',JSON.stringify(database));
		inuse = 0;
		res.end('Updated ' + n_updated + ' entries in database. Recommend reloding local database');
	    }
	    else res.end('No entries recieved. May be due to format error.');
	});
	
    }
    else if (URL.path === "/getdatabase") {
	console.log('fetching database data');
	while (inuse) { console.log("Waiting to read database"); }
	inuse = 1;
	res.write(fs.readFileSync('database.json','utf-8'));
	inuse = 0;
	res.end();
    }
    else if (URL.path === "/getsites") {
	console.log('fatching sites');
	while (inuse) { console.log("Waiting to read database"); }
	inuse = 1;
	res.write(fs.readFileSync('sites.json','utf-8'));
	inuse = 0;
	res.end();
    }
    else if (URL.path === '/addsites') {
	console.log('add new site');
	res.writeHead(200, {'Content-Type': 'text/html'});
	var body = '';
	req.on('data', function (chunk) { body += chunk.toString(); } )
	req.on('end', function () {
	    console.log(body);
	    var data = JSON.parse(body);
	    if (data.length > 0) {
		console.log(data);
		while (inuse) { console.log("Waiting for databse");}
		inuse = 1;
		var database = JSON.parse(fs.readFileSync('sites.json','utf-8'));
		database = database.concat(data);
		fs.writeFileSync('sites.json',JSON.stringify(database));
		inuse = 0;
		console.log("Inserted " + (database.length - length) + " documents");
		output = "Added " + (database.length - length) + " entries.";
		res.end(output);
	    }
	    else res.end('No entries recieved. May be due to format error.');
	});
    }
    else {
	res.writeHead(200, {'Content-Type': 'text/html'});
	res.write('<meta charset="UTF-8">');
	res.write('<html><body><h1>HTTP 404 Not found</h1><p>Requested page not found</p><p><a href="/index.html">HOME</a></p></body></html>');
	res.end();
    }
}).listen(8080); 

