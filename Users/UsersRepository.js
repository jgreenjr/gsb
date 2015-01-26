var level = require("level");
var sub = require("level-sublevel");

module.exports = function (db)
{
  var Users = db.sublevel("Users");

  Users.put("user_admin", {username:"admin@gsb.com", RedirectUrl:'bank.html', defaultBank:"mybank"});

  this.GetUser = function(username, callback){
    var found = false;
    Users.createReadStream()
    .on("data", function(data){
      if(data.value.username == username){
        found = true;
        var returnValue = {"username":data.value.username, "RedirectUrl":data.value.RedirectUrl, "defaultBank":data.value.defaultBank};
        callback(null, returnValue);
        return;
      }
    })
    .on("end", function(){
      if(!found)
        callback("User Not Found");
    })
    .on("error", function( err){
      callback(err)
    });
  }

  return this;

}
