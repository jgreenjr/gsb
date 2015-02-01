var level = require("level");
var sub = require("level-sublevel");
var defaultValue = require("../defaultValues.json");
module.exports = function (db)
{
    var categories = db.sublevel("Categories");

      this.GetList = function(title, callback){
        var allData = [];

        if(title == null || title == undefined){
          title = "default"
        }

        categories.createReadStream({start:title+":",end:title+":\xff"})
        .on("data", function(data){
          allData.push(data.value);
        })
        .on('error', callback)
        .on('close', function ()
        {
              if(allData.length == 0){
              CreateDefaultList(title, GetList, callback);
              return;
            }
            callback(null, allData);
        })
     }

     this.SaveToList = function(title, data, callback){
         categories.put(title+":"+data.name, data, callback)
     }

     function CreateDefaultList(title, callback, otherCallback){
       var ops = [];
       for(var i = 0; i < defaultValue.length;i++){
         ops.push(createItem(title,  defaultValue[i]));
       }

       categories.batch(ops, function (err) {
         if (err) return console.log('Ooops!', err)
          callback(title, otherCallback);
         })

     }

     function createItem(title, value){
       value.title = title;
       return {type: 'put', key: title+":"+value.name, value:  value};
     }

     return this;
};
