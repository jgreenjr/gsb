var http = require("http");
var url = require("url");
var Bank = require("./Bank");
var Transaction = require("./Transaction")
var fs = require("fs");
var HtmlFileLoader = require("./HtmlFileLoader.js")
var responseHandler = require("./responseHandler.js")
var banks = [];


var server = http.createServer(function(request, response){
     var responseFunctions =responseHandler.CreateResponseHandler(request, response);
      
     var parsed = url.parse(request.url);
     
     if(parsed.pathname == "/")
        parsed.pathname = "/bank.html";
    
     if(request.headers.accept.indexOf("text/html") != -1 ){
         responseFunctions.responseType="text/html";
         responseFunctions.errorResponseType = "text/html";
         HtmlFileLoader.LoadHTMLFile(parsed.pathname, responseFunctions);
         return; 
     }
    
     
      if(parsed.pathname.indexOf(".js") != -1)
    {
        responseFunctions.responseType="application/javascript";
         responseFunctions.errorResponseType="text/html";
         HtmlFileLoader.LoadHTMLFile(parsed.pathname, responseFunctions);
         return; 
    }
    
     var b = null;
    if(parsed.pathname!=="/banks"){
     for(var i =0; i < banks.length; i++){
         if(banks[i].Title() == request.headers.bank){
             b=banks[i];
             
             break;
         }
     } 
     if(b === null){
      
         fs.readFile(request.headers.bank + ".bank", function(err, fileData){
             if(err)
             {
                responseHandler.SendResponseWithType(response, 400, JSON.stringify([{message: 'Bank was not loaded'}]), "application/json" );
                return;
             }
             var toLoad = fileData.toString();
           
             b = Bank.CreateBank(JSON.parse(toLoad));
             banks.push(b);
             response.writeHead(302, {
                'Location': request.url,
                'bank': b.Title()
            });
            response.end();
         });
         return;
     }
     
    }
     
     switch (parsed.pathname.toLowerCase()) {
         case "/bank":
              responseHandler.SendResponse(response,200, b.GetDisplay());
              return;
        case "/transaction":
            switch(request.method.toLowerCase()){
                case "post":
                    ProcessTransaction(request, response, b, b.AddTransaction)
                    return;
                case "put":
                    ProcessTransaction(request, response, b, b.UpdateTransaction);
                    return;
                case "delete":
                    ProcessTransaction(request, response, b, b.DeleteTransaction);
                    return;
            }
            if(request.method.toLowerCase() == "post"){
              
            }
            
            if(request.method.toLowerCase() == "put"){
                
            }
            
             if(request.method.toLowerCase() == "delete"){
                ProcessTransaction(request, response, b, b.UpdateTransaction);
                return;
            }
          
            case "PlannedTransaction":
                SendResponse(response,200, b.GetDisplay());
            
            break;
            case "/banks":
                fs.readdir(".", function(err, files){
                    if(err){
                         SendResponseWithType(response, 400, JSON.stringify([{message: 'Cannot Find List of Banks'}]), "application/json" );
                        return;
                    }
                    
                    var banks = [];
                    for(var i = 0; i < files.length; i++){
                        var index = files[i].indexOf(".bank");
                        
                        if( index != -1){
                            banks.push({bankName: files[i].substr(0,index)})
                        }
                        }
                    
                    
                    SendResponseWithType(response, 200, JSON.stringify(banks), "application/json" );
                        return;
                });
                
                break;
         default:
              SendResponse(response, 400, "{errorCode:'BADENDPOINT', errorMessage:'Unhandled Endpoint'}");
     }
});

var port = process.env.PORT;
if(process.argv[2])
{
    port = process.argv[2]
}
console.log(port);
server.listen(port);
console.log("Server is listening" + port);

/*
function SendResponse(response, statusCode, responseMessage){
   SendResponseWithType(response, statusCode, responseMessage, "application/json")
}
*/
function ProcessTransaction(request, response, b, processTransactionFunction){
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
