var Transaction = require("./Transaction.js")
var helpers = require("./helpers.js");
var saver = require("./saver.js");
var fs = require("fs");

var level = require("level")
var sub = require("level-sublevel")

var db = sub(level("./data"));

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

exports.CreatePlan = function(planName){
    var planDb = db.sublevel("plan_"+planName);
    
    this.AddTransaction = function(transaction){
        var date = new Date();
        if(transaction.id === undefined || transaction.id === "")
            transaction.id = "item_"+(date.getMonth()+1)+""+date.getDate()+""+date.getFullYear()+Killspaces(transaction.payee);
        planDb.put(transaction.id, transaction);
    }
    
    
    
    this.PopulatePlan = function(startdate, days, bank, callback){
        var startingBalance = bank.GetBalances();
        var planResult = {transactions:[], warnings:[]};
        var date = new Date(startdate);
        var backingData = []
        planDb.createReadStream({start:"item_", end:"item_\xff"})
        .on("data", function(w){
            if(w.value.active)
                backingData.push(w.value);
        })
        .on("error", callback)
        .on("end", function(){
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
            callback(null,planResult);
        })
        
       
        
        return;
    }
    
    
    
    this.GetDisplay = function(callback){
        var backingData = [];
       planDb.createReadStream({start:"item_", end:"item_\xff"})
        .on("data", function(w){
            backingData.push(w.value);
        })
        .on("error", callback)
        .on("end", function(){
            callback(null, backingData);
        }
        );
    }
    
    
    return this;
}


function SendResponse(plan, bank, responseFunctions, days)
    {
        if(bank)
             {
                 plan.PopulatePlan(Date.now(), days ,bank, responseFunctions.SendPlanJson)
                 return;
             }
            plan.GetDisplay(responseFunctions.SendPlanJson,responseFunctions.SendPlanJson)
    }
    
exports.planIsLoaded = function(planName){
    for(var i = 0; i < plans.length; i++)
    {
        if(plans[i].name == planName){
            return plans[i].plan;
        }
    }
    console.log("plan not found");
    return null;
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