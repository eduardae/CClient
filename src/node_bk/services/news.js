var express = require('express');
var _ = require('underscore');
var cors = require('cors');
var moment = require('moment');
var app = express();
app.use(cors());
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI('23d72701cd1f48c9b1d8b31c357da5eb');


app.get('/', function (req, res) {
  getBtcNews().then(function(data){
    res.json(data);
  });
})

app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

var server = app.listen(8083, function () {
   var host = server.address().address;
   var port = server.address().port;

   console.log("Example app listening at http://%s:%s", host, port);
});

var getBtcNews = async function() {
  let current_date = moment().format("yyyy-MM-dd");
  let interval_date = moment().subtract(1, 'd').format("yyyy-MM-dd");
  let data  = await newsapi.v2.everything({
    q: 'cryptocurrency',
    domains: 'forbes.com,reuters.com',
    language: 'en',
    from: interval_date,
    to: current_date,
    sortBy: 'relevancy'
  });
  return data;
}
