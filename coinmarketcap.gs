function getUrlOps()
{
  var apiKey = ''; /** add your coinmarketcap api-key here */
  var ops = {
  headers : {
              'X-CMC_PRO_API_KEY': apiKey,
              'Accept':'application/json'}};
  return ops;
}

function getCoinPrices_coinmarketcap(coins) {
  var coinsStr = coins.join();
  var ops = getUrlOps();
  var url = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes' +
    '/latest?symbol='+coinsStr+'&convert=USD';
  var response = UrlFetchApp.fetch(url, ops);
  var data = JSON.parse(response.getContentText());
  var pricePairs = [];
  Object.keys(data.data).forEach(function(coin) {
    var price = data.data[coin].quote.USD.price;
      pricePairs.push({'coin':coin, 'price':price});
    });
    return pricePairs;
}

function getGlobalMarketCapCMC() {
  var ops = getUrlOps();
  var url = 'https://pro-api.coinmarketcap.com/v1/global-metrics/quotes/latest';
  var response = UrlFetchApp.fetch(url, ops);
  var data = JSON.parse(response.getContentText());
  var currentMarket = data.data.quote.USD.total_market_cap;
  return currentMarket;
}

