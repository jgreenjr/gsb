var request = require("request");


module.exports = function(config){

    var url = config["CategoryService"].server;
    var port = config["CategoryService"].port;

    this.GetList = function(name,callback){
        var getUrl = "http://"+url+":"+port+"/"+name;
        console.log(getUrl);
        request.get(getUrl, function (error, response, body) {
            console.log(body);
        //    console.log(response);
            console.log(error);
        });
    }

    this.SaveList = function(name, values, callback){
      var getUrl = "http://"+url+":"+port+"/"+name;
      console.log(values);

      request.post({url:getUrl, body: values,headers: {
        'Content-Type': 'application/json'
      }}, function(error, response, body){

        callback({data: body, status: response.statusCode});
        console.log(response);
        console.log(body);
        console.log(error);
      });
    };

    return this;
}
