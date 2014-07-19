var Transaction = require("./Transaction.js");
var helpers = require("./helpers.js");
var Saver = require("./saver.js");
exports.CreateBank = function(json, summaryGeneratorFactory){
    
    exports.InitAccount(json);
    
    var backingData = json;
    
    var summmaryGenerator = undefined;
    if(summaryGeneratorFactory)
        summmaryGenerator = summaryGeneratorFactory.CreateNewGenerator(backingData.Transactions);
    
    
    this.Title = function(){return backingData.title; }
    this.Save = function(){Saver.Save(backingData, "bank")}
    
    this.FindTransaction = function(id){
         var i = 0;
        for(i = 0; i < backingData.Transactions.length; i++){
            if(backingData.Transactions[i].id == id){
                return backingData.Transactions[i];
            }
        }
        return null;
    }
    this.AddTransaction = function(transaction){
      backingData.Total = helpers.UpdateTotal(backingData.Total, transaction);
      transaction.balance = backingData.Total;
      transaction.Status = "Pending";
        var transDate = new Date(transaction.date);
       
        
        for(var i = 0; i < backingData.Transactions.length; i++){
            if(new Date(backingData.Transactions[i].date) <= transDate )
            {
                backingData.Transactions.splice(i,0, transaction);
                return transaction.id;
            }
        }
        backingData.Transactions.push(transaction)
      
        return transaction.id;
        
        
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
       
        var total =  {ActualBalance:0}; 
        if( i < backingData.Transactions.length -1){
            total = helpers.CopyTotal( backingData.Transactions[i+1].balance);
        }
        
        while(i >= 0){
            total = helpers.UpdateTotal(total, backingData.Transactions[i])
            json.Transactions[i].balance = helpers.CopyTotal(total); 
            i--;
        }
       
        backingData.Total = helpers.CopyTotal(total);
    };
    
    this.Total = function(){return backingData.Total}
    this.GetDisplay = function(){return JSON.stringify(backingData);};
    
    this.GetSummary = function(){
        return summmaryGenerator.Generate();
    
    };
        
    
    return this;
}



exports.InitAccount=function(json){
  
    json.Total = {ActualBalance:0};
    
    if(json.Transactions === undefined)
        json.Transactions = [];
    else{
            var i = 0;
            var total = {ActualBalance:0};
            for(i = json.Transactions.length-1; i >=0 ; i--){
               if(!json.Transactions[i].category || json.Transactions[i].category == undefined)
                    json.Transactions[i].category = "Not Specified";
                     if(!json.Transactions[i].Status || json.Transactions[i].Status == undefined)
                      json.Transactions[i].Status = "Pending";
            total = helpers.UpdateTotal(total, json.Transactions[i])
               json.Transactions[i].balance = helpers.CopyTotal(total); 
               i
            }
            json.Total = total;
        }
      
}

