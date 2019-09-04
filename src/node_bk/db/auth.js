var url = "mongodb://admin:password@localhost:27017";
// A Client to MongoDB
var MongoClient = require('mongodb').MongoClient;
  var express = require('express');
var _ = require('underscore');
var cors = require('cors');
var app = express();
app.use(cors());

app.get('/auth', async function (req, res) {
  // Make a connection to MongoDB Service
   MongoClient.connect(url, function(err, db) {
     if (err) throw err;
     console.log("Connected to MongoDB!");
     db.close();
     res.write('Bella');
   });
   res.write('Nope');
})

app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

var server = app.listen(8082, function () {
   var host = server.address().address;
   var port = server.address().port;

   console.log("Example app listening at http://%s:%s", host, port);
});
