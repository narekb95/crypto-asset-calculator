//Todo prices that do not exist on pancake swap could be imported
//from pancake swap or add a field in table where to get price
function myFunction() {

  /** add all your bsc addresses here. You can add more than two addresses (code should to be updated manually) */
  var bscaddr1 = ''; 
  var bscaddr2 = '';

  var rowOfFirstCoin = 4;
  var numOfCoinRows = 25;
  var rowOfFirstToken = 35;
  var numOfTokenRows = 10;

  var spreadsheet = SpreadsheetApp.getActive();
  //assert existst
  var assetsSheet = spreadsheet.getSheetByName('metadata');
  //assert exists
  var historySheet = spreadsheet.getSheetByName('history-value');
  //assert exists
  var spotSheet = spreadsheet.getSheetByName('history-spot');

  Logger.log('Updating global market data');
  updateGlobalData(assetsSheet);

  Logger.log('Updating coins');
  var coinRange = assetsSheet.getRange(rowOfFirstCoin, 1, numOfCoinRows, 1);
  var coins = coinRange.getValues();
  coins = trimTrail(coins);
  updateCoinPrices(coins, rowOfFirstCoin, numOfCoinRows, assetsSheet);
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

  Logger.log('Adding data to history');
  addTableEntry(assetsSheet, 2, 14);
  addValueHistoryData(historySheet, assetsSheet, rowOfFirstCoin, numOfCoinRows);
  addSpotHistoryData(spotSheet, assetsSheet, rowOfFirstCoin, numOfCoinRows);
}

function updateGlobalData(assetsSheet)
{
  var globalMarketCap = getGlobalMarketCapCMC();
  assetsSheet.getRange('R37').setValue(globalMarketCap);
}

function updateCoinPrices(coins, rowOfFirstCoin, numOfCoinRows, sheet) {
  var coinPricePairsList = getCoinPrices_coinmarketcap(coins);
  var coinPricePairs = {};
  coinPricePairsList.forEach((pair, index) => {
    coinPricePairs[pair.coin] = pair.price;
  })

  coins.forEach((coin, index) => {
    sheet.getRange(index + rowOfFirstCoin, 2).setValue(coinPricePairs[coin]);
  })
}

function updateAssets(holdingPairs, exchangeColumn, rowOfFirstCoin, numOfCoinRows, sheet) {
  holdingPairs.forEach((pair, index) => {
    for (i = rowOfFirstCoin; i < rowOfFirstCoin + numOfCoinRows; i++) {
      if (sheet.getRange(i, 1).getValue() == pair.coin) {
        sheet.getRange(i, exchangeColumn).setValue(pair.amount);
      }
    }
  })
}

function updateBSCprices(tokens, rowOfFirstToken, numOfTokenRows, sheet) {
  var tokenList = tokens.map(token => token.name)
  var tokenPricePairsList = getTokenPrices_pancake(tokens);
  var tokenPricePairs = {};
  tokenPricePairsList.forEach((pair, index) => {
    tokenPricePairs[pair.token] = pair.price;
  })

  tokenList.forEach((token, index) => {
    sheet.getRange(index + rowOfFirstToken, 6).setValue(tokenPricePairs[token]);
  })
}

function updateBSCWalletBalance(tokens, bscaddr, walletCulomn, rowOfFirstToken, numOfTokenRows, sheet) {
  var tokenList = tokens.map(token => token.name)
  var tokenHoldingPairsList = getTokenHoldings_bscscan(tokens, bscaddr);
  var tokenHoldingPairs = {};
  tokenHoldingPairsList.forEach((pair, index) => {
    tokenHoldingPairs[pair.token] = pair.holdings;
  })

  tokenList.forEach((token, index) => {
    sheet.getRange(index + rowOfFirstToken, walletCulomn).setValue(tokenHoldingPairs[token]);
  })



}

function addTableEntry(sheet, row, column) {
  var totalValue = sheet.getRange('I36').getValue();
  var rows = sheet.getRange(row, column, 200, 1).getValues();
  var index = rows.findIndex((x) => (x[0] == ''));
  var date = new Date();

  sheet.getRange(row + index, column).setValue(date.toLocaleDateString());
  sheet.getRange(row + index, column + 1).setValue(date.toLocaleTimeString());
  sheet.getRange(row + index, column + 2).setValue(totalValue);
}

function addValueHistoryData(sheet, dataSheet, rowOfFirstCoin, numOfCoinRows) {
  var date = new Date();
  var totalValue = dataSheet.getRange('I36').getValue();
  var bep20Value = dataSheet.getRange('G43').getValue();
  var rows = sheet.getRange(2, 2, 1000, 1).getValues();
  var index = rows.findIndex((x) => (x[0] == ''));
  index += 2;
  sheet.getRange(index, 2).setValue(date.toLocaleString());
  sheet.getRange(index, 3).setValue(totalValue);
  sheet.getRange(index, 4).setValue(bep20Value);

  var coinRange = dataSheet.getRange(rowOfFirstCoin, 1, numOfCoinRows, 1);
  var coins = coinRange.getValues();
  coins = trimTrail(coins);
  var valueRange = dataSheet.getRange(rowOfFirstCoin, 10, coins.length, 1);
  var coinValues = valueRange.getValues();

  var coinValuePairs = {};
  coins.forEach((coin, i) => { coinValuePairs[coin] = coinValues[i] });


  var columnRange = sheet.getRange(1, 5, 1, 30);
  var columns = columnRange.getValues()[0];
  columns = trimTrailLocal(columns);
  columns.forEach((outputcoin, col) => {
    var total = coinValuePairs[outputcoin];
    sheet.getRange(index, col + 5).setValue(total);
  })
}

function addSpotHistoryData(sheet, dataSheet, rowOfFirstCoin, numOfCoinRows) {
  var date = new Date();
  var rows = sheet.getRange(2, 2, 30, 1).getValues();
  var tableEntry = rows.findIndex((x) => (x[0] == ''));
  tableEntry += 2;

  var coinRange = dataSheet.getRange(rowOfFirstCoin, 1, numOfCoinRows, 1);
  var coins = coinRange.getValues();
  coins = trimTrail(coins);
  var assetRange = dataSheet.getRange(rowOfFirstCoin, 9, coins.length, 1);
  var holdings = assetRange.getValues();
  var coinAssetPairs = {};
  coins.forEach((coin, index) => { coinAssetPairs[coin] = holdings[index] });

  if (tableEntry > 2) {
    var assetsChanged = false;
    var lastTableEntry = tableEntry - 1;

    var columnRange = sheet.getRange(1, 3, 1, 30);
    var columns = columnRange.getValues()[0];
    columns = trimTrailLocal(columns);
    columns.forEach((outputcoin, col) => {
      var oldValue = sheet.getRange(lastTableEntry, col + 3).getValue();
      var newValue = coinAssetPairs[outputcoin];
      if (oldValue != newValue) {
        assetsChanged = true;
      }
    })
    if (!assetsChanged) {
      return;
    }
  }

  sheet.getRange(tableEntry, 2).setValue(date.toLocaleString());
  var columnRange = sheet.getRange(1, 3, 1, 30);
  var columns = columnRange.getValues();
  columns = columns[0];
  columns = trimTrailLocal(columns);
  columns.forEach((outputcoin, col) => {
    var holdings = coinAssetPairs[outputcoin];
    sheet.getRange(tableEntry, col + 3).setValue(holdings);
  })
}

function trimTrailLocal(array) {
  return array.splice(0, array.findIndex((x) => (x == '')));
}

function trimTrail(array) {
  return array.splice(0, array.findIndex((x) => (x[0] == '')));
}
