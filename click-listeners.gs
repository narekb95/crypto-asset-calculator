function onclickUpdatePrice()
{
  var bscaddr1 = '0x372a9Fc79653129bfA0d59A8F1dF99d6a8C92c94';
  var bscaddr2 = '0x3cA0f222a6dbDe5616F8a9C13F21e9FC767abf02';
  var rowOfFirstCoin = 4;
  var numOfCoinRows = 25;
  var rowOfFirstToken = 35;
  var numOfTokenRows = 10;
  var spreadsheet = SpreadsheetApp.getActive();
  //assert existst
  var assetsSheet = spreadsheet.getSheetByName('metadata');
  //assert exists

  var coinRange = assetsSheet.getRange(rowOfFirstCoin,1, numOfCoinRows, 1);
  var coins = coinRange.getValues();
  coins = trimTrail(coins);
  updateGlobalData(assetsSheet);
  updateCoinPrices(coins,rowOfFirstCoin, numOfCoinRows, assetsSheet);
  var cexHoldingPairs = getAssets_cex();
  var gateHoldingPairs = getAssets_gate();
  updateAssets(cexHoldingPairs, 3, rowOfFirstCoin, numOfCoinRows, assetsSheet);
  updateAssets(gateHoldingPairs, 4, rowOfFirstCoin, numOfCoinRows, assetsSheet);
  
  Logger.log('Updatign BSC tokens');
  var tokenRange = assetsSheet.getRange(rowOfFirstToken, 1, numOfTokenRows, 3);
  var tokenRangeVal = tokenRange.getValues();
  tokenRangeVal = trimTrail(tokenRangeVal);
  var tokens = tokenRangeVal.map((val) => { return { 'name': val[0], 'contract': val[1], 'decimals': val[2] } });
  updateBSCprices(tokens, rowOfFirstToken, numOfTokenRows, assetsSheet);
  updateBSCWalletBalance(tokens, bscaddr1, 4, rowOfFirstToken, numOfTokenRows, assetsSheet);
  Utilities.sleep(1000);
  updateBSCWalletBalance(tokens, bscaddr2, 5, rowOfFirstToken, numOfTokenRows, assetsSheet);
}
