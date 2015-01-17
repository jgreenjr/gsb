var url = require("url")
var Transaction = require("./Transaction")

exports.CreateResponseHandler = function(request, response){
    var parsed = url.parse(request.url)
    var isHtml = request.headers.accept.indexOf("text/html") ;
    var returnValue = 
    {
        response: response,
        request: request,
        parsedResponse: parsed ,
        responseType: GetResponseType(isHtml, parsed, false),
        errorResponseType: GetResponseType(isHtml, parsed, true),
        
        SendResponseWithType: function (statusCode, responseMessage, type){
                returnValue.response.writeHead(statusCode, {"Content-Type": type});
                returnValue.response.write(responseMessage);
                returnValue.response.end();
            },
            
        ProcessTransaction: function (b, processTransactionFunction){
     request.on("data", function(stream){
         var trans = {};
            var myText = stream.toString();
            try{
              trans = JSON.parse(myText);
            }catch(ex){
                  returnValue.SendResponse(400, JSON.stringify({errorCode:"InvalidJson", message:"InvalidJson:"+myText}));
                  return;
            }
                
            var validationResult = Transaction.Validate(trans);
        
        if(validationResult.length !== 0){
            returnValue.SendResponseWithType(400, JSON.stringify(validationResult), returnValue.errorResponseType);
            return;
        }
    
        processTransactionFunction(trans);
        b.UpdateTransactions();
        b.Save()
        returnValue.SendResponseWithType(200, b.GetDisplay(), returnValue.responseType);
            
        });
},
    SendResponse: function (statusCode, responseMessage){
        returnValue.SendResponseWithType(statusCode, responseMessage, returnValue.responseType)
    },
    
    SendPlanJson: function (error, json){
        if(error){
             returnValue.SendResponseWithType(400, error, "application/json");
             return;
        }
        
        
        returnValue.SendResponseWithType(200, JSON.stringify(json), "application/json")
    }
    
    }
    return returnValue;
}

 
        
function GetResponseType(isHtml, parsed, error){
    
            if(isHtml != -1){
                return "text/html";
            }
            else if(parsed.pathname.indexOf(".js") != -1)
            {
                if(!error)
                    return "application/javascript";
                return "text/html";
            }
            
            return "application/json";
        }