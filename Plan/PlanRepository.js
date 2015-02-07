var LINQ = require('node-linq').LINQ;
var helpers = require('../helpers.js');
module.exports = function (db)
{
  var Plans = db.sublevel("Plans");

  this.GetAll = function(bank,callback){
    var returnValue = {};
    var allData = [];
    Plans.createReadStream({start:bank+":",end:bank+":\xff"})
    .on("data", function(data){
      allData.push(data.value);
    })
    .on('error', callback)
    .on('close', function () {
      var sortedTransactions =  new LINQ(allData).OrderBy(function(transaction){return new Date(transaction.startDate)})
      .ToArray();
    //  returnValue.Total = SumUpData(sortedTransactions)
      returnValue.Transactions = sortedTransactions
      callback(null,returnValue );
    });


  };

  this.PopulatePlan = function(startdate, days, bank, backingData, callback){

    var startingBalance = {ActualBalance: 0, ClearedBalance: 0, FutureBalance:0};
    var planResult = {transactions:[], warnings:[]};
    var date = new Date(startdate);
    for(var i = 0; i < days; i++){
      for(var j = 0; j < backingData.Transactions.length; j++){
        var trans = backingData.Transactions[j];
        var id = (date.getMonth()+1)+""+date.getDate()+""+date.getFullYear()+Killspaces(trans.payee);
        if(trans.active && IsValidDate(trans,date) && new LINQ(bank.Transactions).Where(function(item){return item.id == id}).Count() == 0){
          startingBalance = helpers.UpdateTotal(startingBalance, trans);
          planResult.transactions.push({id:id ,payee:trans.payee, date:(date.getMonth()+1)+"/"+date.getDate()+"/"+date.getFullYear(), amount:trans.amount, type:trans.type, balance:helpers.CopyTotal(startingBalance), category:trans.category, Status:"pending"});
        }
      }
      date.setDate(date.getDate()+1);
    }
    planResult.TransactionCount =  planResult.transactions.length;
    planResult.Total = startingBalance;
    callback(null, JSON.stringify(planResult));
  }


  function Killspaces(str){
    var result = "";
    for(var i = 0; i < str.length; i++){
      if(str[i]!=" ")
      {
        result += str[i];
      }
    }

    return result;
  }


  function IsValidDate(trans, date){
    var startDate = new Date(trans.startDate);
    if(date < startDate)
      return false;
      switch(trans.repeatUnit){
        case "day":
          var time = date - startDate;
          var day = Math.floor(time / 86400000);

          return day % trans.repeatInterval === 0;
          case "month":
            var xDay = date.getDate();
            var yDay = startDate.getDate();

            var xMonth = date.getMonth();
            var yMonth = startDate.getMonth();

            var monthDiff = yMonth - xMonth;

            return (xDay == yDay && monthDiff % trans.repeatInterval===0);
          }

          return false;
        }


  this.AddPlanItem = function(bank, transaction, callback){

    Plans.put(bank+":"+transaction.id, transaction, callback);
  }

  this.RemovePlanItem = function(bank, id, callback){
    Plans.del(bank+":"+id, callback);
  }
  return this;
};
