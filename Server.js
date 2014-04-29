var http = require("http");
var url = require("url");
var Bank = require("./Bank");
var Transaction = require("./Transaction")
var fs = require("fs");

var banks = [];


var server = http.createServer(function(request, response){
      
     var parsed = url.parse(request.url);
     
     if(parsed.pathname == "/")
        parsed.pathname = "/bank.html";
    
     if(request.headers.accept.indexOf("text/html") != -1 ){
         fs.readFile("html/"+parsed.pathname, function(err, data) {
             
             if(err){
                 SendResponseWithType(response, 404, "Cannot Find File:"+parsed.pathname, "text/html");
                 return;
             }
         SendResponseWithType(response, 200, data.toString(), "text/html");
         return;
         });
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
     
      if(parsed.pathname.indexOf(".js") != -1)
    {
          fs.readFile("html/"+parsed.pathname, function(err, data) {
             
             if(err){
                 SendResponseWithType(response, 404, "Cannot Find File:"+parsed.pathname, "text/html");
                 return;
             }
         SendResponseWithType(response, 200, data.toString(), "application/javascript");
          return;
         });
         return;
    }
     
     if(b === null){
      
         fs.readFile(request.headers.bank + ".bank", function(err, fileData){
             if(err)
             {
                SendResponseWithType(response, 400, JSON.stringify([{message: 'Bank was not loaded'}]), "application/json" );
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
              SendResponse(response,200, b.GetDisplay());
              return;
        case "/transaction":
            if(request.method.toLowerCase() == "post"){
                ProcessTransaction(request, response, b, b.AddTransaction)
                return;
            }
            
            if(request.method.toLowerCase() == "put"){
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
                        console.log(index);
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

server.listen(process.env.PORT);
console.log("Server is listening");

function SendResponseWithType(response, statusCode, responseMessage, type){
    response.writeHead(statusCode, {"Content-Type": type});
    response.write(responseMessage);
    response.end();
}

function SendResponse(response, statusCode, responseMessage){
   SendResponseWithType(response, statusCode, responseMessage, "application/json")
}

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
