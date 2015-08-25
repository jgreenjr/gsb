var level = require("level");
var sub = require("level-sublevel");
var md5 = require('MD5');
module.exports = function (db)
{
  CreatePassword = function(user, password){
  return md5(password+user[calculateSalt(user)]);
  }


  CheckPassword = function(user, password){

    var hash = CreatePassword(user, password);
    return user.password == hash;
  }

  ValidateUserPin = function(username, signature, payee, callback){
    this.GetUser(username, function(err, user){
      if(err){
        callback(err);
        return;
      }

      if(user.Pin == undefined || user.Pin == "" || !user.Pin){
        callback("No Pin Set")
        return;
      }

      if(user.defaultBank == ""){
        callback("No Default Bank Set");
        return;
      }

      var localSignature = GetUserSignature(user, "");

      if(signature != localSignature){
        callback("Bad Pin");
        return;
      }
      var returnValue = {"username":user.username, "RedirectUrl":user.RedirectUrl, "defaultBank":user.defaultBank};
      callback(null, returnValue);
    })
  };

  function GetUserSignature(user, url){
    return md5(user.username+""+user.Pin)
  }

  function calculateSalt(user){
    return ""
  }

  var Users = db.sublevel("Users");
  var admin = {username:"admin@gsb.com", RedirectUrl:'private/BankConfiguration.html', defaultBank:"defaultBank", InsertDate:Date.now(), canCreateUser:true, canCreateBank: true, Pin:"1234"};
  admin.password = CreatePassword(admin, "password1");
  Users.put("user_admin", admin);

  this.GetUser = function(username, callback){
    var found = false;
    Users.createReadStream()
    .on("data", function(data){
      if(data.value.username == username){
        found = true;
        callback(null, data.value);
        return;
      }
    })
    .on("end", function(){
      if(!found)
        callback("User Not Found", null);
    })
    .on("error", function( err){
      callback(err, null)
    });
  }

  this.GetUserPermissions = function(username, callback){
    GetUser(username, function(err, user){
      if(err){
        callback(err);
        return;
      }

      callback(null, {canCreateUser: user.canCreateUser, canCreateBank: user.canCreateBank});
    });
  }

  this.LoginUser = function(username, password, callback){
    this.GetUser(username, function(err, user){
      if(err){
        callback(err);
        return;
      }

      if(!CheckPassword(user, password))
      {
        callback("bad password", null);
        return;
      }

      var returnValue = {"username":user.username, "RedirectUrl":user.RedirectUrl, "defaultBank":user.defaultBank};
      callback(null, returnValue);

    });

  }

  this.CreateUser = function(username, password, defaultBank, callback){
    this.GetUser(username, function(err, user){
      if(user != null){
        callback(err, null);
        return;
      }

      var user = {username:username, RedirectUrl:'private/bank.html', defaultBank:defaultBank, InsertDate:Date.now()};

      user.password = CreatePassword(user, password);
      var atSpot = user.username.indexOf("@");
      Users.put("user_"+user.username.substr(0,atSpot), user);
      callback(null, user);
    });
  }

  this.UpdateUser= function(username, password, defaultBank,pin,  callback){
      this.GetUser(username, function(err, user){
          if(user == null){
              callback("User not found");
              return;
          }

          if(pin !== "") {
            user.Pin = pin;
          }

          if(password !== "") {
            user.password = CreatePassword(user, password);
          }

          user.defaultBank =defaultBank;

          var atSpot = user.username.indexOf("@");
          Users.put("user_"+user.username.substr(0,atSpot), user);

          callback(null, user);
      })
  }

  return this;

}
