var http = require("http");
var url = require("url");
var Bank = require("./Bank");
var saver = require("./saver")
var fs = require("fs");
var HtmlFileLoader = require("./HtmlFileLoader.js")
var responseHandler = require("./ResponseHandler.js")
var summaryGeneratorFactory = require("./SummaryGenerator.js")
var CategoriesManager = require("./CategoriesManager");
var planner = require("./Planner")


var banks = [];
var cm = null;

var users = null;

function IsAuthenticated(request){
    return true;
}

var activeSessions = [];

function hash(value) {
  var hash = 0, i, chr, len;
  if (value.length == 0) return hash;
  for (i = 0, len = value.length; i < len; i++) {
    chr   = value.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

function AddActiveSession(username, ip){
    var id = username+Math.floor(Math.random()*1000)
    activeSessions.push({id:id, username:username, ip:ip});
    return id;
}

function CheckActiveSession(session, ip){
    for(var i = 0; i < activeSessions.length; i++){
        if(activeSessions[i].id == session && activeSessions[i].ip == ip){
            return true;
        }
    }
    return false;
}

function GetUsersOfSession(session){
    for(var i = 0; i < activeSessions.length; i++){
        if(activeSessions[i].id == session){
            return activeSessions[i].username;
        }
    }
    return "error";
}


function RemoveActiveSession(session){
    for(var i = 0; i < activeSessions.length; i++){
        if(activeSessions[i].id == session){
            activeSessions.splice(i,i+1);
            return;
        }
    }
}
function GetUser(username, hashword){
    
    for(var i = 0; i < users.length; i++){
        if(users[i].username == username ){
            if(hash(users[i].username+users[i].password) == hashword)
            return users[i];
        }
    }
    return null;
}



function parseCookies (request) {
    var list = {},
        rc = request.headers.cookie;
    rc && rc.split(';').forEach(function( cookie ) {
        var parts = cookie.split('=');
        list[parts.shift().trim()] = unescape(parts.join('='));
    });

    return list;
}


var server = http.createServer(function(request, response){
     var responseFunctions =responseHandler.CreateResponseHandler(request, response);
      
     var parsed = url.parse(request.url);
     var query = GetQueryArguments(parsed.query);
     var cookies = parseCookies(request);
     if(parsed.pathname == "/")
        parsed.pathname = "/login.html";
     
      if(parsed.pathname.indexOf(".js") != -1)
    {
        responseFunctions.responseType="application/javascript";
         responseFunctions.errorResponseType="text/html";
         HtmlFileLoader.LoadHTMLFile(parsed.pathname, responseFunctions);
         return; 
    }
       
    if(parsed.pathname != "/login.html" 
        && parsed.pathname != "/login" && !CheckActiveSession(cookies.sessionKey, request.connection.address().address)){
        
         response.writeHead(302, {
                'Location': "login.html"
                
            });
            response.end();
        return;
    }
    
     if(request.headers.accept.indexOf("text/html") != -1 ){
         responseFunctions.responseType="text/html";
         responseFunctions.errorResponseType = "text/html";
         HtmlFileLoader.LoadHTMLFile(parsed.pathname, responseFunctions);
         return; 
     }
    
     
     var b = null;
    if(parsed.pathname!=="/banks" && parsed.pathname!=="/categories" && parsed.pathname!== "/login" && parsed.pathname !=="/logout"){
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
                responseFunctions.SendResponseWithType(400, JSON.stringify([{message: 'Bank was not loaded'}]), "application/json" );
                return;
             }
             var toLoad = fileData.toString();
           
             b = Bank.CreateBank(JSON.parse(toLoad), summaryGeneratorFactory.CreateNewGenerator(cm));
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
         case "/login":
             var username = query.Username
             var passHash = query.Hassword
             var user = GetUser(username, passHash);
             if(user == null){
                 responseFunctions.SendResponse(400,JSON.stringify({"ErrorCode":"INVALID_USER", "Message":"Invalid Username and password"}));
                 return;
             }
             var id = AddActiveSession(username, request.connection.address().address);
              responseFunctions.SendResponse(200,JSON.stringify({"sessionKey":id, "RedirectUrl":user.defaultUrl}));
              return;
        case "/logout":
            RemoveActiveSession(cookies.sessionKey);
             responseFunctions.SendResponse(200,JSON.stringify({"message":"logged out"}));
            return;          
         case "/bank":
             b.UpdateTransactions();
              responseFunctions.SendResponse(200, b.GetDisplay());
              return;
        case "/transaction":
            switch(request.method.toLowerCase()){
                case "get":
                   var transaction = b.FindTransaction(parsed.query);
                   if(transaction === null)
                   {
                       responseFunctions.SendResponse(404,  JSON.stringify({errorCode:404, errorMessage:"notFound" }));
                       return;
                   }
                   responseFunctions.SendResponse(200,  JSON.stringify(transaction));
                     return;
                case "post":
                    responseFunctions.ProcessTransaction(b, b.AddTransaction)
                    return;
                case "put":
                    responseFunctions.ProcessTransaction(b, b.UpdateTransaction);
                    return;
                case "delete":
                    responseFunctions.ProcessTransaction(b, b.DeleteTransaction);
                    return;
            }
          
            case "/bankplan":
              switch(request.method.toLowerCase()){
                case "get":
                planner.LoadPlan(request.headers.bank, responseFunctions, b, query.Days)
                return;
              }
                break;
                
            case "/plan":
              switch(request.method.toLowerCase()){
                case "get":
                planner.LoadPlan(request.headers.bank, responseFunctions)
                return;
              }
                break;
            case "/banks":
                fs.readdir(".", function(err, files){
                    if(err){
                         responseFunctions.SendResponseWithType(400, JSON.stringify([{message: 'Cannot Find List of Banks'}]), "application/json" );
                        return;
                    }
                    
                    var banks = [];
                    for(var i = 0; i < files.length; i++){
                        var index = files[i].indexOf(".bank");
                        
                        if( index != -1){
                            banks.push({bankName: files[i].substr(0,index)})
                        }
                        }
                    var returnValue = {username: GetUsersOfSession(cookies.sessionKey), banks: banks}
                    
                    responseFunctions.SendResponseWithType(200, JSON.stringify(returnValue), "application/json" );
                        return;
                });
                
                break;
                case "/categories":
                   cm.GetResponse("json",responseFunctions )
                   return;
                    break;
                case "/summary":
                  var summary = b.GetSummary(query.startDate, cm);
                    responseFunctions.SendResponseWithType(200, JSON.stringify(summary), "application/json" );
                    break;
         default:
             responseFunctions.SendResponse(400, "{errorCode:'BADENDPOINT', errorMessage:'Unhandled Endpoint'}");
     }
});

var port = process.env.PORT;
if(process.argv[2])
{
    port = process.argv[2]
}


saver.Load("cats","cats", function(data){cm = CategoriesManager.CreateCategoriesManager(JSON.parse(data)); 
saver.Load("users","user", function(data){users =JSON.parse(data) 
server.listen(port);
console.log("Server is listening"); });});

function GetQueryArguments(query){
    var result = {};
    
    if(!query){
        return result
    }
    
    var passedValues = query.split("&");
    for(var i = 0; i < passedValues.length; i++){
        var nameValuePair = passedValues[i].split('=');
        result[nameValuePair[0]] = nameValuePair[1];
    }
    return result;
}

/*
function SendResponse(response, statusCode, responseMessage){
   SendResponseWithType(response, statusCode, responseMessage, "application/json")
}
*/

