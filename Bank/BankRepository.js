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
        var sortedTransactions =  new LINQ(allData).OrderByDescending(function(transaction){return new Date(transaction.date)})

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

  var SumUpData = function(transactions){


    var currentTotal = {ActualBalance: 0, ClearedBalance: 0, FutureBalance:0}
    for(var i = transactions.length -1 ; i >= 0; i--){
     var newTotal = helpers.UpdateTotal(currentTotal, transactions[i]);
     transactions[i].balance = helpers.CopyTotal(currentTotal);
    }
    return currentTotal;
  }

  this.AddTransaction = function(bank, transaction, callback){
      Banks.put(bank+":"+transaction.id, transaction, callback);
  }
  this.DeleteTransaction = function(bank, id, callback){
    Banks.del(bank+":"+id, callback);
  }
  return this;
}
