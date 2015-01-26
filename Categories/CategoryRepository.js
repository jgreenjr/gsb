var level = require("level");
var sub = require("level-sublevel");

module.exports = function (db)
{
    var categories = db.sublevel("Categories");
    categories.put("category_default", [{"name":"Income - Paycheck"},{"name":"Income - Other"},{"name":"Food"},{"name":"Bills"},{"name":"Fun"},{"name":"Houseshold"},{"name":"Automotive"}])
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

        if(title == null || title == undefined){
          title = "default"
        }
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
