var LINQ = require('node-linq').LINQ;
var helpers = require('../helpers.js');
var Sort = require('node-sort');

var sort = new Sort();

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
        allData = sort.mergeSort(allData, GetIndicationSort)
        var sortedTransactions =  new LINQ(allData)


        if(showFutureItems ==false){
        sortedTransactions = sortedTransactions.Where(function(item){return getTransactionDate(item) < new Date()});}

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

  function GetIndicationSort(left, right){
    var leftDate = getTransactionDate(left);
    var rightDate = getTransactionDate(right);

    var leftInserted = new Date(left.InsertDate);
    var rightInserted = new Date(right.InsertDate);

    if( leftDate< rightDate){
      return 1;
    }
    else if( leftDate > rightDate){
      return -1;
    }
    else if( leftInserted < rightInserted){
        return 1;
    }
    else if( leftInserted > rightInserted){
      return -1;
    }
    else if( left.payee < right.payee){
      return -1;
    }
    else if( left.payee > right.payee){
      return 1;
    }
    return 0;
  }


  function getTransactionDate(transaction)
  {

    if(transaction.date == "Pending")
    {
      var now = new Date();
      var str = (now.getMonth()+1)+"/"+now.getDate()+"/"+now.getFullYear();
      return new Date(str);
    }
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
    var byCategory = [];
    var catIndex = [];
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
            AddCategory(data.value.category, amount, byCategory, false, catIndex);
            break;
            case "deposit":
              tdc++;
              td += amount
              AddCategory(data.value.category, amount, byCategory, true, catIndex);
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
        ByCategory: byCategory
      });
    });
  }


  AddCategory = function(cat, amount, list, isDeposit, catIndex){

    var index = catIndex[cat];




    if(index == null){
      list.push({Widthdrawls: 0, Deposit: 0, Gains:0, category: cat});
      index =  list.length - 1;
      catIndex[cat] = index;
    }

    if(isDeposit){
      list[index].Deposit += amount;
      list[index].Gains += amount;
    }
    else{
      list[index].Widthdrawls += amount;
      list[index].Gains -= amount;
    }


  };

  this.AddTransaction = function(bank, transaction, callback){
      Banks.put(bank+":"+transaction.id, transaction, callback);
  }
  this.DeleteTransaction = function(bank, id, callback){
    Banks.del(bank+":"+id, callback);
  }

  this.DeleteTransactions = function(bank, callback){
    Banks.createReadStream({start:bank+":",end:bank+":\xff"})
        .on("data", function(data){
          Banks.del(data.key, function(){});
        })
        .on("close", callback);
  }
  return this;
}
