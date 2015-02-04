var level = require("level");
var sub = require("level-sublevel");
var db = sub(level("./data",{valueEncoding:"json"}));
var BankRepository = require('./Bank/BankRepository.js')(db);
var PlanRepository = require('./Plan/PlanRepository.js')(db);
var fs = require("fs");

console.log("Moving ",process.argv[2], " to bank ", process.argv[3] );

var data = fs.readFileSync(process.argv[2]+".bank");

var jsonData = JSON.parse(data.toString()).Transactions;

for(var i = 0; i <jsonData.length;i++)
{
  //console.log(jsonData[i]);
  BankRepository.AddTransaction(process.argv[3] ,jsonData[i], function(err){if(err){console.log(err)}});
}

if(fs.existsSync(process.argv[2]+".plan")){
  var data2 = fs.readFileSync(process.argv[2]+".plan");

  var jsonData2 = JSON.parse(data2.toString()).Transactions;

  for(var i = 0; i <jsonData2.length;i++)
  {
    jsonData2[i].active = true;
    jsonData2[i].id = "tp"+i;
    PlanRepository.AddPlanItem(process.argv[3] ,jsonData2[i], function(err){if(err){console.log(err)}});
  }
}
