exports.Validate = function(json){
    var messages = exports.StandardTransactionValidation(json);
    
     if(!Date.parse(json.date))
      messages.push({errorCode:"InvalidDate", message:"Invalid Date"});
      
      
    return messages
}

exports.StandardTransactionValidation = function(json)
{
    var messages = [];
    if(json.amount <= 0 || !json.amount || isNaN(json.amount))
        messages.push({errorCode:"InValidAmount", message:"Invalid Amount"});
    else
    {
        json.amount = parseFloat(json.amount).toFixed(2);
    }
    
     if(exports.Types.indexOf(json.type) < 0)
         messages.push({errorCode:"InvalidType", message:"Invalid Type"});   
     
     if(!json.payee)
      messages.push({errorCode:"InvalidPayee", message:"Invalid Payee"});
     
     return messages;
}

exports.Types = ["deposit", "widthdrawl"];