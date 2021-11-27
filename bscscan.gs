function getTokenHoldings_bscscan(tokens, address) {

  var apiKey = ''; /** add your bscscan api-key here */
  var holdings = [];
  var query = 0;
  tokens.forEach((token,index)=>
  {
    if(query > 0 && query % 5 == 0)
    {
      Utilities.sleep(1000);
    }
    query++;
    var tokenName = token.name;
    var contract = token.contract;
    var decimals = token.decimals;
    var url = 'https://api.bscscan.com/api?module=account&action=tokenbalance&contractaddress='
      + contract + '&address=' + address + '&tag=latest&apikey=' + apiKey;
    var response = UrlFetchApp.fetch(url);
    var data = JSON.parse(response.getContentText());
    var value;
    if(data.result == null)
    {
      value = 'Bad value';
    }
    else
    {
      value = data.result / Math.pow(10, decimals);
    }
    holdings.push({'token':tokenName, 'holdings':value});
  });
  return holdings;
}

