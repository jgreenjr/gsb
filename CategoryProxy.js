var request = require("request");


module.exports = function(config){
    
    var url = config["CategoryService"].url;
    var port = config["CategoryService"].port;
    
    this.GetList = function(name,callback){
        var getUrl = "http://"+url+":"+port+"/"+name;
        request.get(getUrl, function (error, response, body) {
            console.log(body);
            console.log(error);
        });
    }
    
    return this;
}