var express = require('express');
var _ = require('underscore');
var cors = require('cors');
var moment = require('moment');
var app = express();
app.use(cors());
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI('23d72701cd1f48c9b1d8b31c357da5eb');
var CryptoNewsAPI = require('crypto-news-api').default;


app.get('/', function (req, res) {
  getNews().then(function (data) {
    res.json(data);
  });
})

app.get('/bycoin/:id', function (req, res) {
  getNewsByCoin(req.params.id).then(function (data) {
    res.json(data);
  });
})

app.all('/*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

var server = app.listen(8083, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log("Example app listening at http://%s:%s", host, port);
});

var getBtcNews = async function () {
  let current_date = moment().format("yyyy-MM-dd");
  let interval_date = moment().subtract(2, 'd').format("yyyy-MM-dd");
  let data = await newsapi.v2.everything({
    q: 'cryptocurrency',
    domains: 'decrypt.co,coindesk.com,forbes.com',
    language: 'en',
    from: interval_date,
    to: current_date,
    sortBy: 'date'
  });
  return data;
}

var getNews = async function () {
  // Connect to the CryptoControl API
  const Api = new CryptoNewsAPI('75dd43125e51eefa036d1ce38fba8507');
  let articles = await Api.getTopNews();

  return articles;
}

var getNewsByCoin = async function (coinName) {
  // Connect to the CryptoControl API
  const Api = new CryptoNewsAPI('75dd43125e51eefa036d1ce38fba8507');
  let articles = Api.getLatestNewsByCoin(coinName);
  return articles;
}
/* USAGE EXAMPLES
var printSomeInfo = async function () {
  // For ES5, use the below import instead
  // var CryptoNewsAPI = require('crypto-news-api').default

  // Connect to the CryptoControl API
  const Api = new CryptoNewsAPI('75dd43125e51eefa036d1ce38fba8507');

  // Connect to a self-hosted proxy server (to improve performance) that points to cryptocontrol.io
  //const ProxyApi = new CryptoNewsAPI('75dd43125e51eefa036d1ce38fba8507', 'http://cryptocontrol_proxy/api/v1/public');


  // Enable the sentiment datapoints
  Api.enableSentiment()

  // Get top news
  Api.getTopNews()
    .then(function (articles) {
      console.log(articles)
    })
    .catch(function (error) { console.log(error) })

  // Get latest russian news
  Api.getTopNews("ru")
    .then(function (articles) { console.log(articles) })
    .catch(function (error) { console.log(error) })

  // Get top news for Bitcoin
  Api.getTopNewsByCoin("bitcoin")
    .then(function (articles) {
      console.log(articles)
    })
    .catch(function (error) { console.log(error) })

  // Get latest tweets for EOS
  Api.getLatestTweetsByCoin("eos")
    .then(function (tweets) { console.log(tweets) })
    .catch(function (error) { console.log(error) })

  // Get latest reddit posts for Ripple
  Api.getLatestRedditPostsByCoin("ripple")
    .then(function (redditPosts) { console.log(redditPosts) })
    .catch(function (error) { console.log(error) })

  // Get a combined feed (reddit/twitter/articles) for Litecoin
  Api.getTopFeedByCoin("litecoin")
    .then(function (feed) { console.log(feed) })
    .catch(function (error) { console.log(error) })

  // Get all reddit/tweets/articles (separated) for NEO
  Api.getTopItemsByCoin("neo")
    .then(function (feed) { console.log(feed) })
    .catch(function (error) { console.log(error) })

  // Get coin details for ethereum
  Api.getCoinDetails("ethereum")
    .then(function (details) { console.log(details) })
    .catch(function (error) { console.log(error) })

} */
