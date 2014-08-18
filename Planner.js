var Transaction = require("./Transaction.js")
var helpers = require("./helpers.js");
var saver = require("./saver.js");
var fs = require("fs");

exports.ValidateTransaction = function(json){
    var errors = Transaction.StandardTransactionValidation(json);
    
    if(!Date.parse(json.startDate)){
        errors.push({errorCode: "InvalidStartDate", errorMessage: "Invalid Start Date"});
    }
    
    if(isNaN(json.repeatInterval))
    {
        errors.push({errorCode: "InvalidrepeatInterval", errorMessage: "Invalid Days Til Repeat"})
    }
    
     if(!json.repeatUnit)
    {
        errors.push({errorCode: "InvalidrepeatUnit", errorMessage: "Invalid Repeat Unit"})
    }
    
    return errors;
};

exports.CreatePlan = function(json){
    var backingData = json
    
    this.AddTransaction = function(transaction){
        transaction.IsValidDate = IsValidDate;
        backingData.Transactions.push(transaction);
    }
    
    this.PopulatePlan = function(startdate, days, bank){
        var startingBalance = bank.GetBalances();
        var planResult = {transactions:[], warnings:[]};
        var date = new Date(startdate);
        for(var i = 0; i < days; i++){
            for(var j = 0; j < backingData.Transactions.length; j++){
                var trans = backingData.Transactions[j];
                var id = (date.getMonth()+1)+""+date.getDate()+""+date.getFullYear()+Killspaces(trans.payee);
                if(IsValidDate(trans,date) && bank.FindTransaction(id) == null){
                    startingBalance = helpers.UpdateTotal(startingBalance, trans);
                    if(startingBalance.ActualBalance < 0){
                        planResult.warnings.push({errorCode:"negitiveBalanceWarning", errorMessage:"Negitive Balance as a result of transaction", transaction: trans.payee});
                    }
                    planResult.transactions.push({id:id ,payee:trans.payee, date:(date.getMonth()+1)+"/"+date.getDate()+"/"+date.getFullYear(), amount:trans.amount, type:trans.type, balance:helpers.CopyTotal(startingBalance), category:trans.category, Status:"pending"});
                }
            }
             date.setDate(date.getDate()+1);
        }
        planResult.TransactionCount =  planResult.transactions.length;
        
        return JSON.stringify(planResult);
    }
    
    this.Save = function(){
        saver.Save(backingData, "plan");
    }
    
    return this;
}

exports.LoadPlan = function(planName,responseFunctions,bank){
    
    console.log("loadingFile" + planName);
         fs.readFile(planName + ".plan", function(err, fileData){
             console.log(err)
             if(err)
             {
                responseFunctions.SendResponseWithType(400, JSON.stringify([{message: 'Bank was not loaded'}]), "application/json" );
                return;
             }
             var toLoad = fileData.toString();
           
             var b = exports.CreatePlan(JSON.parse(toLoad));
             if(bank)
             {
                 responseFunctions.SendResponseWithType(200,b.PopulatePlan(Date.now(), 7 ,bank),"application/json")
                 return;
             }
              responseFunctions.SendResponseWithType(200,b.PopulatePlan(Date.now(), 7 ,bank.GetBalances()),"application/json")
         });
         return;
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