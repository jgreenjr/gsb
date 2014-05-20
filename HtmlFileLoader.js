var fs = require("fs");

exports.LoadHTMLFile = function(fileName, responseFunctions)
{
   
         fs.readFile("html/"+fileName, function(err, data) {
             
             if(err){
                 responseFunctions.SendResponseWithType(responseFunctions.response, 404, "Cannot Find File:"+fileName, responseFunctions.errorResponseType);
                 return;
             }
         responseFunctions.SendResponseWithType(responseFunctions.response, 200, data.toString(), responseFunctions.responseType);
         return;
         });
         return;
     
}