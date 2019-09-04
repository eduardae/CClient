var express = require('express');
var _ = require('underscore');
var cors = require('cors');
var app = express();
app.use(cors());
const CoinGecko = require('coingecko-api');
//2. Initiate the CoinGecko API Client
const CoinGeckoClient = new CoinGecko();

app.get('/', async function (req, res) {
  let data = await CoinGeckoClient.coins.all();
  res.json(data);
})

app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port

   console.log("Example app listening at http://%s:%s", host, port)
})
