var http = require("http");
var url = require("url");
var Bank = require("./Bank");
var fs = require("fs");
var Transaction = require("./Transaction")
var b = Bank.CreateBank({name:"becu"})

var server = http.createServer(function(request, response){
      
     var parsed = url.parse(request.url);
     
     switch (parsed.pathname.toLowerCase()) {
         case "/bank":
              SendResponse(response,200, b.GetDisplay());
              return;
        case "/transaction":
            if(request.method.toLowerCase() == "post"){
                 var trans = {};
               request.on("data", function(stream){
                    try{
                      trans = JSON.parse(stream.toString());
                    }catch(ex){
                          SendResponse(response, 400, JSON.stringify({errorCode:"InvalidJson", message:"InvalidJson"}));
                          return;
                    }
                        
                    var validationResult = Transaction.Validate(trans);
                
                if(validationResult.length !== 0){
                    SendResponse(response, 400, JSON.stringify(validationResult));
                    return;
                }
            
                b.AddTransaction(trans);
                fs.writeFile("./Data.bank", b.GetDisplay());
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

function SendResponse(response, statusCode, responseMessage){
    response.writeHead(statusCode, {"Content-Type": "application/json"});
    response.write(responseMessage);
    response.end();
}

