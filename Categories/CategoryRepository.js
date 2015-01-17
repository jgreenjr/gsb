var level = require("level");
var sub = require("level-sublevel");
    
module.exports = function (dbPath)
{
     var db = sub(level("./data",{valueEncoding:"json"}));
     
     var categories = db.sublevel("All");
     
     this.GetLists = function(callback){
         var results = [];
        categories.createReadStream()
            .on("data", function(data){
                results.push(data.value.name);
            })
            .on("end", function(){
                callback(null, results);
            })
             .on("error", function( err){
              callback(err)
            });
     }
     
      this.GetList = function(title, callback){
        
        categories.get("category_"+title, function(err,data){
            if(err){
                callback(err);
                return;
            }
            callback(null, data);
        })
     }
     
     this.SaveList = function(title, data, callback){
         categories.put("category_"+title, data, callback)
     }
     
     return this;
};
