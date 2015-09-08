var LINQ = require('node-linq').LINQ;

module.exports = function (db)
{
  var bank = db.sublevel("BankMetaData");

  this.GetAllUserBanks = function(user, callback){
    var returnValue = [];
      bank.createReadStream()
      .on("data", function(data){
        if(new LINQ(data.value.users).Contains(user)){

          returnValue.push({"bankName": data.value.title, "BudgetStartDate": data.value.BudgetStartDate, "BudgetEndDate": data.value.BudgetEndDate});
        }
      })
      .on("end", function(){
        callback(null, returnValue);
        }
      )
        .on("error", function( err){
          callback(err)
        });
      }

    this.GetFullBankData = function(user, callback){
      var returnValue = [];
      bank.createReadStream()
      .on("data", function(data){
        if(new LINQ(data.value.users).Contains(user)){
          returnValue.push(data.value);
        }
      })
      .on("end", function(){
        callback(null, returnValue);
      }
    )
    .on("error", function( err){
      callback(err)
    });
  }

  this.CreateBank = function(bankname,username, callback){
    bank.put("bank_"+bankname, {"title":bankname, users:[username]}, callback);
  }

  this.DeleteBank = function(bankname,username, callback){
    bank.get("bank_"+bankname, function(err, data){
      if(err){
        callback("bank not found")
        return;
      }
      var linqUsers = new LINQ(data.users);

      if(!linqUsers.Contains(currentUser)){
        callback("user does not have access");
        return;
      }
      bank.delete("bank_"+bankname, callback);
    });
  }

  this.UpdateBank = function(data, username, callback){
    bank.get("bank_"+data.title, function(err, data2){
      if(err){
        callback("bank not found")
        return;
      }
      var linqUsers = new LINQ(data.users);

      if(!linqUsers.Contains(username)){
        callback("user does not have access");
        return;
      }
      bank.put("bank_"+data.title, data, callback);
    });

  }


  this.AddUser = function(bankname, username, currentUser, callback){
    var bankKey = "bank_"+bankname;

    bank.get(bankKey, function(err, data){
      if(err){
        callback("bank not found")
        return;
      }

      var linqUsers = new LINQ(data.users);
      if(linqUsers.Contains(username)){
        callback("user already has access");
        return;
      }
      if(!linqUsers.Contains(currentUser)){
        callback("user does not have access");
        return;
      }
      data.users.push(username)

      bank.put(bankKey, data, function(err){
        if(err)
        {
          callback(err);
          return;
        }
        callback(null, "Done!");
      })
    })
  }

  this.DeleteUser = function(bankname, username, currentUser, callback){
    var bankKey = "bank_"+bankname;

    bank.get(bankKey, function(err, data){
      if(err){
        callback("bank not found")
        return;
      }

      var linqUsers = new LINQ(data.users);
      if(!linqUsers.Contains(username)){
        callback("cannot remove user");
        return;
      }
      if(!linqUsers.Contains(currentUser)){
        callback("user does not have access");
        return;
      }


      var indexOf = data.users.indexOf(username);
      data.users.splice(indexOf, 1);

      bank.put(bankKey, data, function(err){
        if(err)
        {
          callback(err);
          return;
        }
        callback(null, "Done!");
      })
    })
  }

  return this;
}
