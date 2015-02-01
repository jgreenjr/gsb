var LINQ = require('node-linq').LINQ;

module.exports = function (db)
{
  var bank = db.sublevel("BankMetaData");

  this.GetAllUserBanks = function(user, callback){
    var returnValue = [];
      bank.createReadStream()
      .on("data", function(data){
        if(new LINQ(data.value.users).Contains(user)){
          returnValue.push({"bankName": data.value.title});
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

  return this;
}
