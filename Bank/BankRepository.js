var LINQ = require('node-linq').LINQ;
var helpers = require('../helpers.js');
module.exports = function (db)
{
  var Banks = db.sublevel("Banks");

  //Banks.put("bank_mybank",{Transactions:[]});

  this.GetDisplay = function(bank, pageNumber, statusFilter, categoryFilter, showFutureItems, callback)
  {
    var allData = [];
    var returnValue = {Transactions:[]};
    Banks.createReadStream({start:bank+":",end:bank+":\xff"})
      .on("data", function(data){
        allData.push(data.value);
      })
      .on('error', callback)
      .on('close', function () {
        var sortedTransactions =  new LINQ(allData).OrderByDescending(getTransactionDate)

        if(statusFilter !="")
          sortedTransactions = sortedTransactions.Where(function(item){return item.Status === statusFilter});
        if(categoryFilter != "")
          sortedTransactions = sortedTransactions.Where(function(item){return item.category === categoryFilter});

        sortedTransactions =  sortedTransactions.ToArray();
        returnValue.Total = SumUpData(sortedTransactions)
        returnValue.Transactions = sortedTransactions
        callback(null,returnValue );
      });

  };
  function getTransactionDate(transaction)
  {
  
    if(transaction.date == "Pending")
      return Date.now();
    return new Date(transaction.date)
  };
  var SumUpData = function(transactions){


    var currentTotal = {ActualBalance: 0, ClearedBalance: 0, FutureBalance:0}
    for(var i = transactions.length -1 ; i >= 0; i--){
     var newTotal = helpers.UpdateTotal(currentTotal, transactions[i]);
     transactions[i].balance = helpers.CopyTotal(currentTotal);
    }
    return currentTotal;
  }

  this.GetSummary = function(bank, startDate,endDate, callback){
    var tw = 0;
    var td = 0;
    var tg = 0;
    var twc = 0;
    var tdc = 0;
    var tc = 0;

    Banks.createReadStream({start:bank+":",end:bank+":\xff"})
    .on("data", function(data){
      var amount = parseInt(data.value.amount);
      var transactionDate = new Date(data.value.date);
      if((!startDate || transactionDate>= new Date(startDate))&&
        (!endDate || transactionDate <= new Date(endDate))){
        tc++;
        switch(data.value.type){
          case "widthdrawl":
            twc++
            tw += amount
            //AddCategory(trans[i].category, amount, byCategory, false);
            break;
            case "deposit":
              tdc++;
              td += amount
              //AddCategory(data.value.category, amount, byCategory, true);
              break;
            }
          }
    })
    .on('error', callback)
    .on('close', function () {
      callback(null, {
        date:new Date().toDateString(),
        TotalWithdrawls:tw,
        TotalWithdrawlsCount: twc,
        TotalDeposits: td,
        TotalDepositsCount: tdc,
        TotalGains: td-tw,
        TotalTransactions: tc,
        ByCategory: []
      });
    });
  }

  this.AddTransaction = function(bank, transaction, callback){
      Banks.put(bank+":"+transaction.id, transaction, callback);
  }
  this.DeleteTransaction = function(bank, id, callback){
    Banks.del(bank+":"+id, callback);
  }
  return this;
}
