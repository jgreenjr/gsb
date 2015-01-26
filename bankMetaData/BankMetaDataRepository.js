var LINQ = require('node-linq').LINQ;

module.exports = function (db)
{
  var bank = db.sublevel("BankMetaData");

  bank.put("bank_mybank", {"title":"mybank", users:["admin@gsb.com"]});

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

  return this;
}
