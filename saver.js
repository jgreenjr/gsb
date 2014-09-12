var fs = require("fs");

exports.Save = function(data, type){
    fs.writeFile(data.title + "." + type, JSON.stringify(data));
};
exports.SaveWithTitle= function(title, type, data){
    fs.writeFile(title + "." + type, data);
};

exports.Load = function(name, type, func){
    fs.readFile(name+"."+type, function(err, data){
        func(data.toString());
    })
}
