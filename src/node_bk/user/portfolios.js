const url = "mongodb://admin:admin@localhost:27017";
// A Client to MongoDB
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const _ = require('underscore');
var crypto = require('crypto');
const cors = require('cors');
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use("/", expressJwt({ secret: 'todo-app-super-shared-secret' }));

app.post('/create_portfolio', function (req, res) {
  // Make a connection to MongoDB Service
  MongoClient.connect(url, function (connerr, client) {
    if (connerr) res.status(500).end(connerr);
    console.log("Connected to MongoDB!");
    const db = client.db('local');
    let reqQuery = req.body;

    db.collection("portfolios").insertOne(reqQuery, function (dberr, dbres) {
      if (dberr) {
        res.status(500).send(dberr);
      } else {
        res.status(200).json(reqQuery);
        client.close();
      }
    }, function (err) {
      res.status(500).end(err);
    });
  });
});

app.get('/get_portfolio/:id', function (req, res) {
  // Make a connection to MongoDB Service
  MongoClient.connect(url, function (connerr, client) {
    if (connerr) res.status(500).end(connerr);
    console.log("Connected to MongoDB!");
    const db = client.db('local');
    db.collection("portfolios").find({ _id: ObjectId(req.params.id) }).toArray(function (dberr, docs) {
      if (dberr) {
        res.status(500).end(dberr);
      } else {
        if (docs && docs.length != 0) {
          res.json(docs[0]);
        } else {
          res.status(404).end('Portfolio not found');
        }
        client.close();
      }
    }, function (err) {
      // done or error
    });
  });
});

app.post('/get_portfolios_by_user', function (req, res) {
  // Make a connection to MongoDB Service
  MongoClient.connect(url, function (connerr, client) {
    if (connerr) res.status(500).end(connerr);
    console.log("Connected to MongoDB!");
    const db = client.db('local');
    const reqQuery = req.body;
    db.collection("portfolios").find({ userId: reqQuery._id }).toArray(function (dberr, docs) {
      if (dberr) {
        res.status(500).end(dberr);
      } else {
        if (docs && docs.length != 0) {
          res.json(docs);
        } else {
          res.status(404).end('No portfolio found');
        }
        client.close();
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

var server = app.listen(8085, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log("Example app listening at http://%s:%s", host, port);
});
