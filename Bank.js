var Transaction = require("./Transaction.js");
var helpers = require("./helpers.js");
var Saver = require("./saver.js");
exports.CreateBank = function(json){
    
    exports.InitAccount(json);
    
    var backingData = json;
    
    
    this.Title = function(){return backingData.title; }
    this.Save = function(){Saver.Save(backingData, "bank")}
    this.AddTransaction = function(transaction){
      backingData.Total = helpers.UpdateTotal(backingData.Total, transaction);
      transaction.balance = backingData.Total;
        var transDate = new Date(transaction.date);
       
        
        for(var i = 0; i < backingData.Transactions.length; i++){
            if(new Date(backingData.Transactions[i].date) <= transDate )
            {
                backingData.Transactions.splice(i,0, transaction);
                return transaction.Id;
            }
        }
        backingData.Transactions.push(transaction)
      
        return transaction.Id;
        
        
    };
    this.UpdateTransaction = function(transaction){
        var i = 0;
        for(i = 0; i < backingData.Transactions.length; i++){
            if(backingData.Transactions[i].id == transaction.id){
                break;
            }
        }
        if( i == backingData.Transactions.length){
            return;
        }
        
        backingData.Transactions[i] = transaction;
        
       UpdateTransactionBalances(i);
    }
    this.DeleteTransaction = function(transaction){
        var i = 0;
         for(i = 0; i < backingData.Transactions.length; i++){
            if(backingData.Transactions[i].id == transaction.id){
                backingData.Transactions.splice(i,1);
                
                break;
            }
        }
       
        UpdateTransactionBalances(i-1);
    }
    
    function UpdateTransactionBalances(i){
       
        var total = 0; 
        if( i < backingData.Transactions.length -1){
            total = backingData.Transactions[i+1].balance;
        }
        
        while(i >= 0){
            total = helpers.UpdateTotal(total, backingData.Transactions[i])
            json.Transactions[i].balance = total; 
            i--;
        }
       
        backingData.Total = total;
    };
    
    this.Total = function(){return backingData.Total}
    this.GetDisplay = function(){return JSON.stringify(backingData);}
    return this;
}



exports.InitAccount=function(json){
  
    json.Total = 0;
   
    if(json.Transactions === undefined)
        json.Transactions = [];
    else{
            var i = 0;
            var total = 0;
            for(i = json.Transactions.length-1; i >=0 ; i--){
            total = helpers.UpdateTotal(total, json.Transactions[i])
               json.Transactions[i].balance = total; 
            }
            json.Total = total;
        }
      
}