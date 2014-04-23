var Transaction = require("./Transaction.js");

exports.CreateBank = function(json){
    
    exports.InitAccount(json);
    
    var backingData = json;
    
    
    this.Title = function(){return backingData.title; }
    this.Save = function(){exports.Saver.SaveBank(backingData)}
    this.AddTransaction = function(transaction){
      backingData.Total = exports.UpdateTotal(backingData.Total, transaction);
        
        backingData.Transactions.push(transaction)
        
        return transaction.Id;
        
        
    };
    this.Total = function(){return backingData.Total}
    this.GetDisplay = function(){return JSON.stringify(backingData);}
    return this;
}

exports.UpdateTotal = function(currentTotal, transaction)
{
     switch(transaction.type){
            case "deposit":
              currentTotal += parseFloat(transaction.amount);
              break;
              case "widthdrawl":
              currentTotal -= parseFloat(transaction.amount);
              break;
        }
        return currentTotal;
}


exports.InitAccount=function(json){
    if(json.Total === undefined)
        json.Total = 0;
   
    if(json.Transactions === undefined)
        json.Transactions = [];
    else{
            json.Total = 0;
            for(var i = 0; i < json.Transactions.length; i++){
               json.Total = exports.UpdateTotal(json.Total, json.Transactions[i]); 
            }
        }
      
}