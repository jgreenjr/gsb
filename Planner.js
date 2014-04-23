var Transaction = require("./Transaction.js")

exports.ValidateTransaction = function(json){
    var errors = Transaction.StandardTransactionValidation(json);
    
    if(!Date.parse(json.startDate)){
        errors.push({errorCode: "InvalidStartDate", errorMessage: "Invalid Start Date"});
    }
    
    if(isNaN(json.daysTilRepeat))
    {
        errors.push({errorCode: "InvalidDaysTilRepeat", errorMessage: "Invalid Days Til Repeat"})
    }
    
    return errors;
};

exports.CreatePlan = function(json){
    var backingData = json
    
    this.AddTransaction = function(transaction){
        backingData.Transactions.push(transaction);
    }
    
    this.PopulatePlan = function(startdate, days){
        var transactions = [];
        var date = new Date(startdate);
        for(var i = 0; i < days; i++){
            for(var j = 0; j < backingData.Transactions.length; j++){
                var trans = backingData.Transactions[j];
                var time = date.getTime() - new Date(trans.startDate).getTime;
                var days = time / 86400;
                
                if(days % trans.daysTilRepeat == 0){
                    transactions.push({payee:trans.payee, date:date.toDateString(), amount:trans.amount, type:trans.type});
                }
                date += 86400;
            }
        }
        
        return transactions;
    }
    
    return this;
}