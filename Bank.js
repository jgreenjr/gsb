var Transaction = require("./Transaction.js");
var helpers = require("./helpers.js");
exports.CreateBank = function(json){
    
    exports.InitAccount(json);
    
    var backingData = json;
    
    
    this.Title = function(){return backingData.title; }
    this.Save = function(){exports.Saver.SaveBank(backingData)}
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
    this.Total = function(){return backingData.Total}
    this.GetDisplay = function(){return JSON.stringify(backingData);}
    return this;
}



exports.InitAccount=function(json){
    if(json.Total === undefined)
        json.Total = 0;
   
    if(json.Transactions === undefined)
        json.Transactions = [];
    else{
            json.Total = 0;
            for(var i = 0; i < json.Transactions.length; i++){
               json.Total = helpers.UpdateTotal(json.Total, json.Transactions[i])
               json.Transactions[i].balance = json.Total; 
            }
        }
      
}