var http = require('http');
var fs = require('fs');
var MongoClient = require('mongodb').MongoClient;

var settings = JSON.parse(fs.readFileSync('settings.json','utf-8'));

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
    //var search = url.searchParams(req.url);
    if (!URL.path || URL.path === '/index.html' || URL.path === '/' || URL.path === 'data') {
	res.writeHead(200, {'Content-Type': 'text/html'});
	console.log('serv client side app');
	fs.readFile("client_side_app.html", function (err, data) {
	    if (err) { throw err; }
	    res.write(data);
	    res.end();
	});
	fs.readFile
    }
    else if (URL.path === '/submitdata') {
	console.log('handle submitted data');
	res.writeHead(200, {'Content-Type': 'text/html'});
	var body = '';
	req.on('data', function (chunk) { body += chunk.toString(); } )
	req.on('end', function () {
	    //if (body.length < 1) { body = 'no data'; }
	    //var start =0; var end = body.length;
	    //var n_left=0;
	    //var i;
	    console.log(body);
	    var data = JSON.parse(body);
	    if (data.length > 0) {
		console.log(data);
		MongoClient.connect(settings.dbURL, function(err, db) {
		    if (err) throw err;
		    var dbo = db.db(settings.database);
		    dbo.collection(settings.collection).insertMany(data, function(err, resend) {
			if (err) throw err;
			console.log("Inserted " + resend.insertedCount + " documents");
			output = "Added " + resend.insertedCount + " entries.";
			db.close();
			res.end(output);
		    });
		}); 
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
	    //if (body.length < 1) { body = 'no data'; }
	    //var start =0; var end = body.length;
	    //var n_left=0;
	    //var i;
	    //console.log(body);
	    var data = JSON.parse(body);
	    console.log(data);
	    if (data.length > 0) {
		var n_updated=0;
		var no = 0;
	    	for (var i=0; i<data.length; ++i) {
		    if (data[i].accno) {
			MongoClient.connect(settings.dbURL, function(err, db) {
			    if (err) throw err;
			    var dbo = db.db(settings.database);
			    var entry = data[no];
			    ++no;
			    dbo.collection(settings.collection).updateMany({accno: entry.accno}, {$set: entry}, function(err, resend) {
				if (err) throw err;
				console.log("Updated " + resend.result.nModified + " " + entry.accno);
				++n_updated;
				db.close();
				res.end(output);
			    });
			});
		    }
		}
		res.end('Updated database. Recommend reloding local database');
	    }
	    else res.end('No entries recieved. May be due to format error.');
	});
	
    }
    else if (URL.path === "/getdatabase") {
	console.log('fetching database data');
	//res.writeHead(200, {'Content-Type': 'text/html'});
	MongoClient.connect(settings.dbURL, function(err, db) {
	    if (err) throw err;
    	    var dbo = db.db(settings.database);
	    dbo.collection(settings.collection).find({}).toArray(function (err,result) {
		if (err) throw err;
		res.write(JSON.stringify(result));
		db.close();
		res.end();
	    });
	});
    }
    else {
	res.writeHead(200, {'Content-Type': 'text/html'});
	res.write('<meta charset="UTF-8">');
	res.write('<html><body><h1>HTTP 404 Not found</h1><p>Requested page not found</p><p><a href="/index.html">HOME</a></p></body></html>');
	res.end();
    }
}).listen(8080); 
