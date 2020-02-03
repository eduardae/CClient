const url = "mongodb://admin:admin@localhost:27017";
// A Client to MongoDB
const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const bodyParser = require('body-parser');
const _ = require('underscore');
var crypto = require('crypto');
const cors = require('cors');
const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post('/user/update/coins', function (req, res) {
  MongoClient.connect(url, function (connerr, client) {
    if (connerr) res.status(500).end(connerr);
    console.log("Connected to MongoDB!");
    const db = client.db('local');
    const reqQuery = req.body;
    db.collection("users").find({ username: reqQuery.username }).toArray(function (dberr, docs) {
      if (dberr) {
        res.status(500).end(dberr);
      } else {
        if (docs && docs.length != 0) {
          db.collection("users").updateOne({ username: reqQuery.username }, {
            $set:
              { bookmarked_coins: reqQuery.bookmarked_coins }
          }, function (err, insertRes) {
            if (err) throw err;
            res.status(200).end('User bookmarks updated');
            client.close();
          });
        } else {
          res.status(404).end('User not found');
          client.close();
        }
      }
    }, function (err) {
      // done or error
    });


  });
});

app.post('/user/update/links', function (req, res) {
  MongoClient.connect(url, function (connerr, client) {
    if (connerr) res.status(500).end(connerr);
    console.log("Connected to MongoDB!");
    const db = client.db('local');
    const reqQuery = req.body;
    db.collection("users").find({ username: reqQuery.username }).toArray(function (dberr, docs) {
      if (dberr) {
        res.status(500).end(dberr);
      } else {
        if (docs && docs.length != 0) {
          db.collection("users").updateOne({ username: reqQuery.username }, {
            $set:
              { saved_links: reqQuery.saved_links }
          }, function (err, insertRes) {
            if (err) throw err;
            res.status(200).json(reqQuery);
            client.close();
          });
        } else {
          res.status(404).end('User not found');
          client.close();
        }
      }
    }, function (err) {
      // done or error
    });


  });
});

app.all('/*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

var server = app.listen(8084, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log("Example app listening at http://%s:%s", host, port);
});
