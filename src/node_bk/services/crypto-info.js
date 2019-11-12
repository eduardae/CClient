var express = require('express');
var _ = require('underscore');
var cors = require('cors');
const bodyParser = require('body-parser');
var fs = require('fs');
var app = express();
app.use(cors());
app.use(bodyParser.json());
const CoinGecko = require('coingecko-api');

//2. Initiate the CoinGecko API Client
const CoinGeckoClient = new CoinGecko();

app.get('/', function (req, res) {
  getAllData().then(function (data) {
    res.json(data);
  });
})

app.post('/coininfo', function (req, res) {
  const reqQuery = req.body;
  if (reqQuery.coin_name) {
    getCoinData(reqQuery.coin_name).then(function (data) {
      res.json(data);
    });
  } else {
    res.status(400);
  }
});

app.post('/coininfo/marketchart', function (req, res) {
  const reqQuery = req.body;
  if (reqQuery.coin_name) {
    getCoinMarketChart(reqQuery.coin_name, reqQuery.days, reqQuery.vs_currency).then(function (data) {
      res.json(data);
    });
  } else {
    res.status(400);
  }
});

app.post('/coininfo/history', function (req, res) {
  const reqQuery = req.body;
  if (reqQuery.coin_name) {
    getCoinHistory(reqQuery.coin_name, reqQuery.vs_currency).then(function (data) {
      res.json(data);
    });
  } else {
    res.status(400);
  }
});

app.get('/coinslist', function (req, res) {
  let obj;
  //./src/node_bk/config/coins/list.json
  fs.readFile('./src/node_bk/config/coins/list.json', 'utf8', function (err, data) {
    if (err) throw err;
    obj = JSON.parse(data);
    if (obj) {
      res.json(obj);
    } else {
      res.status(404);
    }
  });

});

app.all('/*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

var server = app.listen(8081, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log("Example app listening at http://%s:%s", host, port)
});

var getAllData = async function () {
  let data = await CoinGeckoClient.coins.all();
  return data;
}

var getCoinData = async function (coin_name) {
  let data = await CoinGeckoClient.coins.fetch(coin_name, {});
  return data;
}

var getCoinMarketChart = async function (coin_name, in_days, currency) {
  let data = await CoinGeckoClient.coins.fetchMarketChart(coin_name, { days: in_days, vs_currency: currency });
  return data;
}

var getCoinHistory = async function (coin_name, currency) {
  let data = await CoinGeckoClient.coins.fetchHistory(coin_name, { vs_currency: currency ? currency : 'usd' });
  return data;
}


