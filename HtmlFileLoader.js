var fs = require("fs");

exports.LoadHTMLFile = function(fileName, responseFunctions)
{
   
         fs.readFile("html/"+fileName, function(err, data) {
             
             if(err){
                 responseFunctions.SendResponseWithType(404, "Cannot Find File:"+fileName, responseFunctions.errorResponseType);
                 return;
             }
         responseFunctions.SendResponseWithType(200, data.toString(), responseFunctions.responseType);
         return;
         });
         return;
     
}