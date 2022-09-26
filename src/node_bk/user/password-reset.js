const url = "mongodb://admin:admin@localhost:27017";
// A Client to MongoDB
const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const bodyParser = require('body-parser');
const _ = require('underscore');
const cors = require('cors');
var nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use("/", expressJwt({ secret: 'todo-app-super-shared-secret' , algorithms: ["HS256"] }).unless({ path: ['/user/password_reset_mail'] }));

/* TODO: retrieve from db config */
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ccryptomonitor@gmail.com',
    pass: 'CryptoMonitor'
  }
});

app.post('/user/password_reset_mail', function (req, res) {
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
          if (docs[0].email) {
            let mailOptions = {
              from: 'ccryptomonitor@gmail.com',
              to: docs[0].email,
              subject: 'CMonitor Password Reset',
              text: 'That was easy!'
            };
            transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                res.status(500).end("Mail error");
              } else {
                res.status(200).end('Password reset mail sent');
              }
            });
          }
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

var server = app.listen(8086, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log("Example app listening at http://%s:%s", host, port);
});
