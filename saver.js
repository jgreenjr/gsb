var fs = require("fs");

exports.Save = function(data, type){
    fs.writeFile(data.title + "." + type, JSON.stringify(data));
};

exports.Load = function(name, type, func){
    fs.readFile(name+"."+type, function(err, data){
        func(data.toString());
    })
}