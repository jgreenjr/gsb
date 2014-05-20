var url = require("url")

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
        
        SendResponseWithType: function (response, statusCode, responseMessage, type){
                response.writeHead(statusCode, {"Content-Type": type});
                response.write(responseMessage);
                response.end();
            },
            
        ProcessTransaction: function (request, response, b, processTransactionFunction){
     request.on("data", function(stream){
         var trans = {};
            var myText = stream.toString();
            try{
              trans = JSON.parse(myText);
            }catch(ex){
                  SendResponse(response, 400, JSON.stringify({errorCode:"InvalidJson", message:"InvalidJson:"+myText}));
                  return;
            }
                
            var validationResult = Transaction.Validate(trans);
        
        if(validationResult.length !== 0){
            SendResponse(response, 400, JSON.stringify(validationResult));
            return;
        }
    
        processTransactionFunction(trans);
        b.Save()
        SendResponse(response,200, b.GetDisplay());
            
        });
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