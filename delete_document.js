var MongoClient = require('mongodb').MongoClient;
var fs = require("fs");
var settings = JSON.parse(fs.readFileSync('settings.json'));
//console.log(settings.database);
var toDelete = ["MR54321"];
var no = 0;
for (var i=0; i<toDelete.length; ++i) {
    MongoClient.connect(settings.dbURL, function(err, db) {
	if (err) throw err;
	toDel = toDelete[no];
	++no;
	var dbo = db.db(settings.database);
	dbo.collection(settings.collection).deleteMany({accno: toDel}, function(err, res) {
	    if (err) throw err;
	    console.log("Deleted " + res.result.n + " " + toDel);
	    db.close();
	});
    }); 
}
