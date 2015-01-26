var LINQ = require('node-linq').LINQ;

module.exports = function (db)
{
  var Banks = db.sublevel("Banks");

  Banks.put("bank_mybank",{Total:{ActualBalance: 0, ClearedBalance: 0, FutureBalance:0}});

  this.GetDisplay = function(bank, pageNumber, statusFilter, categoryFilter, showFutureItems, callback)
  {
    console.log(bank);
    var bankData = Banks.get("bank_"+bank, function(err, data){
      console.log(data);
      callback(null,data);
    });

  };

  return this;
}
