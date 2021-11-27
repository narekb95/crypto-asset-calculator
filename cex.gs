function getAssets_cex(coins) {
  /** add your cex api-key, api-secret here and user-id */
  var apiKey = '';
  var apiSecret = '';
  var userId = '';
  var nonce = BigInt((new Date()).getTime()).toString();
  var apiMessage = nonce + userId + apiKey;
  var hash = Utilities.computeHmacSha256Signature(apiMessage, apiSecret);
  var signature = hash.reduce(function(str,chr){
  chr = (chr < 0 ? chr + 256 : chr).toString(16);
  return str + (chr.length==1?'0':'') + chr;
  },'');

  var formData = {
  'key': apiKey,
  'signature': signature,
  'nonce': nonce
  };
  var options = {
  'method' : 'post',
  'payload' : formData,
  };
  var url = 'https://cex.io/api/balance/';
  var response = UrlFetchApp.fetch(url, options);
  var data = JSON.parse(response.getContentText());
  var holdingPairs = [];
  Object.keys(data).forEach(function(coin) {
    var amount = data[coin].available;
    if(amount == 0)
    {
      return;
    }
    holdingPairs.push({'coin':coin, 'amount':amount});
  });
  return holdingPairs;
}
