function getAssets_gate(coins) {

  /** Add your gate.io api-key and secrete-key here. */
  /** Signed request can be computed as HexEncode(HMAC_SHA512(secret, signature_string)) */
  /** See https://www.gate.io/docs/apiv4/en/#apiv4-signed-request-requirements for more infomration */
  var apiKey = "";
  var secretKey = "";
  var signedrequest = "";

  var urlextension = '/api/v4/spot/accounts';
  var method = 'GET';
  var timestamp = BigInt(Math.ceil((new Date()).getTime() / 1000)).toString();

  var signText = method + '\n' + urlextension + '\n' + ''+ '\n' + signedrequest + '\n' + timestamp;
  var hash = Utilities.computeHmacSignature(Utilities.MacAlgorithm.HMAC_SHA_512, signText, secretKey);
  var signature = hash.reduce(function(str,chr){
  chr = (chr < 0 ? chr + 256 : chr).toString(16);
  return str + (chr.length==1?'0':'') + chr;
  },'');

  var headers = {
    'Content-Type': 'application/json',
    'Timestamp': timestamp,
    'KEY': apiKey,
    'SIGN': signature,
  };
  var options = {
  method : method,
  headers: headers
  };
  var url = 'https://api.gateio.ws' + urlextension;
  var response = UrlFetchApp.fetch(url, options);
  var data = JSON.parse(response.getContentText());
  var holdingPairs = [];
  data.forEach(function(coin) {
    var amount = coin.available;
    if(amount == 0)
    {
      return;
    }
    holdingPairs.push({'coin': coin.currency, 'amount': amount});
  });
  return holdingPairs;
}
