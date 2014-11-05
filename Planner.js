var Transaction = require("./Transaction.js")
var helpers = require("./helpers.js");
var saver = require("./saver.js");
var fs = require("fs");

var plans = [];

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
   var backingData = json;
    
    for(var i = 0; i < backingData.Transactions.length; i++){
        if(backingData.Transactions[i].active === undefined)
            {
                backingData.Transactions[i].active = true;
            }
    }
    
    this.AddTransaction = function(transaction){
        transaction.IsValidDate = IsValidDate;
        backingData.Transactions.push(transaction);
    }
    
    this.UpdatePlanFromRequest = function (request, responseFunctions){
        var self = this;
        console.log("starting update sequence.");
        request.on("data", function(stream){
            var planJson = JSON.parse(stream.toString());
            
            if(self.UpdatePlan(planJson)){
                responseFunctions.SendResponseWithType(200, JSON.stringify([{'message':'succesfully updated plan', 'messageType':'success'}]), 'application/json')
                return;
            }
            responseFunctions.SendResponseWithType(400, JSON.stringify({'message':'failed to update plan', 'messageType':'error'}), 'application/json');
            return
        })
        return;
    }
    
    this.UpdatePlan = function(newPlan){
        for(var i =0; i < newPlan.length; i++){
            var errors = exports.ValidateTransaction(newPlan[i])
            if(errors.length != 0 ){
                return false;
            }
        }
        backingData.Transactions = newPlan;
        return true;
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
    this.GetDisplay = function(){
        return JSON.stringify(backingData);
    }
    
    this.Save = function(){
        saver.Save(backingData, "plan");
    }
    
    return this;
}

exports.LoadPlan = function(planName,responseFunctions,bank, days){
    var plan = exports.planIsLoaded(planName)
        if(!plan)
    {
         fs.readFile(planName + ".plan", function(err, fileData){
            
             if(err)
             {
                responseFunctions.SendResponseWithType(400, JSON.stringify([{message: 'Bank was not loaded'}]), "application/json" );
                return;
             }
             var toLoad = fileData.toString();
            plan = exports.CreatePlan(JSON.parse(toLoad));
         
            plans.push({name: planName, plan: plan});
            SendResponse(plan, bank, responseFunctions, days )
            return;
         });
         return;
    }
    
    SendResponse(plan, bank, responseFunctions, days )
         return;
}

function SendResponse(plan, bank, responseFunctions, days)
    {
        if(bank)
             {
                 responseFunctions.SendResponseWithType(200,plan.PopulatePlan(Date.now(), days ,bank),"application/json")
                 return;
             }
              responseFunctions.SendResponseWithType(200,plan.GetDisplay(),"application/json")
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