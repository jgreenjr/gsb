exports.Validate = function(json){
    var messages = exports.StandardTransactionValidation(json);
    
     if(!Date.parse(json.date))
      messages.push({errorCode:"InvalidDate", message:"Invalid Date"});
      
      if(json.id == undefined){
          var date = new Date();
          json.id = date.getYear() + "_"+date.getMonth() + "_" + date.getDate()  + "_" + date.getHours() + "_" + date.getMinutes() + "_" + date.getSeconds()+ "_" + date.getMilliseconds();   
      }
    
    json.IsFutureItem = new Date(json.date) > new Date();
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
      
     if(!json.category)
        json.category = "Not Specified";
     
     
     return messages;
}

exports.Types = ["deposit", "widthdrawl"];