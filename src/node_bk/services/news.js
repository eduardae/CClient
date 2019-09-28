var express = require('express');
var _ = require('underscore');
var cors = require('cors');
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
  let data  = await newsapi.v2.everything({
    q: 'cryptocurrency',
    domains: 'forbes.com,reuters.com',
    language: 'en',
    from: '2019-08-28',
    to: '2019-28-28',
    sortBy: 'relevancy'
  });
  return data;
}
