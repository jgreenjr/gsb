var fs = require("fs");

exports.Save = function(data, type){
    fs.writeFile(data.name + "." + type, data);
};