exports.Validate = function(json){

    var messages = exports.StandardTransactionValidation(json);

    if(json.date == ""){
      json.date = "Pending";
    }

     if(!Date.parse(json.date) && json.date != "Pending")
      messages.push({errorCode:"InvalidDate", message:"Invalid Date"});


      if(json.id == undefined){
          var date = new Date();
          json.id = date.getYear() + "_"+date.getMonth() + "_" + date.getDate()  + "_" + date.getHours() + "_" + date.getMinutes() + "_" + date.getSeconds()+ "_" + date.getMilliseconds();
      }

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

    if(!json.Status){
        json.Status = "Pending";
    }

    delete json.balance;

    if(!json.InsertDate){

    json.InsertDate = new Date().toISOString().
    replace(/T/, ' ').      // replace T with a space
    replace(/\..+/, '');    // delete the dot and everything after
    json.UpdateDate = "";
    }
    else
    {
      json.UpdateDate = new Date().toISOString().
      replace(/T/, ' ').      // replace T with a space
      replace(/\..+/, '');    // delete the dot and everything after
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
