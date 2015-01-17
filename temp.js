var config = require("./config.json");
var categoryProxy  = require("./CategoryProxy.js");


var cp = categoryProxy(config);
cp.GetList("attempt1");