function getTokenPrices_pancake(tokens) {
  var pricePairs = [];
  tokens.forEach((token,index)=>
  {
    var tokenName = token.name;
    var contract = token.contract;
    url = 'https://api.pancakeswap.info/api/v2/tokens/' + contract;
    var response = UrlFetchApp.fetch(url);
    var data = JSON.parse(response.getContentText());
    var price = data.data.price;
    pricePairs.push({'token':tokenName, 'price':price});
  });
  return pricePairs;
  
}

