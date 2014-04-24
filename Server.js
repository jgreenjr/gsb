var http = require("http");
var url = require("url");
var Bank = require("./Bank");
var Transaction = require("./Transaction")
var fs = require("fs");

var b = Bank.CreateBank({name:"becu"})


var server = http.createServer(function(request, response){
      
     var parsed = url.parse(request.url);
     
     if(parsed.pathname == "/")
        parsed.pathname = "/bank.html";
    
    console.log(parsed);
     
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
     
     switch (parsed.pathname.toLowerCase()) {
         case "/bank":
              SendResponse(response,200, b.GetDisplay());
              return;
        case "/transaction":
            if(request.method.toLowerCase() == "post"){
                 var trans = {};
               request.on("data", function(stream){
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
            
                b.AddTransaction(trans);
               // b.save();
                SendResponse(response,200, b.GetDisplay());
                    
                });
                return;
            }
            case "PlannedTransaction":
                SendResponse(response,200, b.GetDisplay());
            
            break;
         default:
              SendResponse(response, 400, "{errorCode:'BADENDPOINT', errorMessage:'Unhandled Endpoint'}");
     }
});

fs.readFile("./Data.bank", function(err, data) {
    if(err)
        throw err;
    b = Bank.CreateBank(JSON.parse(data.toString()))
     
    server.listen(process.env.PORT);
console.log("Server is listening");
}
)

function SendResponseWithType(response, statusCode, responseMessage, type){
    response.writeHead(statusCode, {"Content-Type": type});
    response.write(responseMessage);
    response.end();
}

function SendResponse(response, statusCode, responseMessage){
   SendResponseWithType(response, statusCode, responseMessage, "application/json")
}

