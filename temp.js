var config = require("./config.json");
var categoryProxy  = require("./CategoryProxy.js");


var cp = categoryProxy(config);
cp.SaveList(process.argv[2], process.argv[3]);
cp.GetList(process.argv[2]);
