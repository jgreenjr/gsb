var level = require("level");
var sub = require("level-sublevel");

var db = sub(level("./data",{valueEncoding:"json"}));

var Banks = db.sublevel("Banks");

var returnValue = {Transactions:[]};
Banks.createReadStream()
.on("data", function(data){
  data.value.InsertDate = new Date().toISOString().
  replace(/T/, ' ').      // replace T with a space
  replace(/\..+/, '');    // delete the dot and everything after
  delete data.value.balance
  data.value.notes = "";
  data.value.UpdateDate = "";
  Banks.put(data.key, data.value);
})
