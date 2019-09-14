const url = "mongodb://admin:admin@localhost:27017";
// A Client to MongoDB
const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const bodyParser = require('body-parser');
const _ = require('underscore');
var crypto = require('crypto');
const cors = require('cors');
const app = express();
app.use( bodyParser.json() );
app.use(cors());

app.post('/auth', function (req, res) {
  // Make a connection to MongoDB Service
   MongoClient.connect(url, function(connerr, client) {
     if (connerr) res.status(500).send(connerr);
     console.log("Connected to MongoDB!");
     const db = client.db('local');
     const reqQuery = req.body;
     db.collection("users").find({username: reqQuery.username}).toArray(function(dberr, docs) {
      if(dberr) {
        res.status(500).send(dberr);
      } else {
        if(docs && docs.length != 0) {
          crypto.scrypt(reqQuery.password, 'edd', 64, (err, derivedKey) => {
            if (err) throw err;
            if(docs[0].password_hash === derivedKey.toString('hex')) {
              res.json(docs[0]);
            }
          });
         } else {
          res.status(404).send('User not found');
         }
         client.close();
      }
    }, function(err) {
      // done or error
    });


   });
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
