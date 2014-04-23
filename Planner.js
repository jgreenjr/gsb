var Transaction = require("./Transaction.js")

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
    
    this.PopulatePlan = function(startdate, days){
        var transactions = [];
        var date = new Date(startdate);
        for(var i = 0; i < days; i++){
            for(var j = 0; j < backingData.Transactions.length; j++){
                var trans = backingData.Transactions[j];
              
                if(trans.IsValidDate(date)){
                    transactions.push({payee:trans.payee, date:date.toDateString(), amount:trans.amount, type:trans.type});
                }
            }
             date.setDate(date.getDate()+1);
        }
        
        return transactions;
    }
    
    return this;
}

function IsValidDate(date){
     var startDate = new Date(this.startDate);
     if(date < startDate)
        return false;
    switch(this.repeatUnit){
        case "day":
            var time = date - startDate;
            var day = Math.floor(time / 86400000);
            
            return day % this.repeatInterval === 0;
        case "month":
            var xDay = date.getDate();
            var yDay = startDate.getDate();
            
            var xMonth = date.getMonth();
            var yMonth = startDate.getMonth();
            
            var monthDiff = yMonth - xMonth;
            
            return (xDay == yDay && monthDiff % this.repeatInterval===0);
    }
    
    return false;
}