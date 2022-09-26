const url = "mongodb://admin:admin@localhost:27017";
// A Client to MongoDB
const MongoClient = require('mongodb').MongoClient;
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
app.use("/", expressJwt({ secret: 'todo-app-super-shared-secret' , algorithms: ["HS256"] }).unless({ path: ['/register', '/login', '/get_token'] }));

app.post('/register', function (req, res) {
  // Make a connection to MongoDB Service
  MongoClient.connect(url, function (connerr, client) {
    if (connerr) res.status(500).end(connerr);
    console.log("Connected to MongoDB!");
    const db = client.db('local');
    let reqQuery = req.body;

    db.collection("users").find({ username: reqQuery.username }).toArray(function (dberr, docs) {
      if (dberr) {
        res.status(500).end(dberr);
      } else {
        if (docs && docs.length != 0) {
          res.status(500).end('Username already in use');
          client.close();
        } else {
          let salt = crypto.randomBytes(64).toString('hex');
          crypto.scrypt(reqQuery.password, salt, 64, (err, derivedKey) => {
            if (err) throw err;
            reqQuery.password_hash = derivedKey.toString('hex');
            delete reqQuery.password;
            reqQuery.salt = salt;
            db.collection("users").insertOne(reqQuery, function (dberr, dbres) {
              if (dberr) {
                res.status(500).send(dberr);
              } else {
                res.status(200).json('User registered');
                client.close();
              }
            }, function (err) {
              res.status(500).end(err);
            });
          });
        }

      }
    }, function (err) {
      // done or error
    });

  });
});

app.post('/login', function (req, res) {
  // Make a connection to MongoDB Service
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
          crypto.scrypt(reqQuery.password, docs[0].salt, 64, (err, derivedKey) => {
            if (err) throw err;
            if (docs[0].password_hash.toString('hex') === derivedKey.toString('hex')) {
              var token = jwt.sign({ userID: docs[0]._id }, 'todo-app-super-shared-secret', { expiresIn: '30m' });
              docs[0].token = token;
              res.json(docs[0]);
            } else {
              res.status(500).end('Wrong password!');
            }
          });
        } else {
          res.status(404).end('User not found');
        }
        client.close();
      }
    }, function (err) {
      // done or error
    });


  });
});

app.post('/get_token', function (req, res) {
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
          var token = jwt.sign({ userID: docs[0]._id }, 'todo-app-super-shared-secret', { expiresIn: '30m' });
          res.status(200).json(token);
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

app.post('/update/settings', function (req, res) {
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
              { name: reqQuery.name, surname: reqQuery.surname, email: reqQuery.email }
          }, function (err, insertRes) {
            if (err) throw err;
            res.json(reqQuery);
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

var server = app.listen(8082, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log("Example app listening at http://%s:%s", host, port);
});
