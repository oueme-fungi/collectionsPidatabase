var MongoClient = require('mongodb').MongoClient;
var fs = require("fs");
var settings = JSON.parse(fs.readFileSync('settings.json'));
//console.log(settings.database);
MongoClient.connect(settings.dbURL, function(err, db) {
  if (err) throw err;
  var dbo = db.db(settings.database);
  dbo.createCollection(settings.collection, function(err, res) {
    if (err) throw err;
    console.log("Collection created!");
    db.close();
  });
}); 
MongoClient.connect(settings.dbURL, function(err, db) {
  if (err) throw err;
  var dbo = db.db(settings.database);
    dbo.ensureIndex(settings.collection,"accno", function(err, opt) {
	if (err) throw err;
	console.log("Index created!");
    db.close();
    });
});
