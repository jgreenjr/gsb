var express = require('express');
var CategoryRepository = require("./CategoryRepository.js");
var bodyParser = require("body-parser");
//var config = require("config.json");

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var port = process.env.PORT;
var cr = CategoryRepository("data");

if(process.argv[2])
{
    port = process.argv[2];
}

app.get("/",function (req, res) {
    cr.GetLists(function(err,data){
        res.setHeader('Content-Type', 'application/json');

        if(err){
            res.status(400).send(err);
        }
        res.send(JSON.stringify(data));
    });

});

app.get("/:name",function (req, res) {
    cr.GetList(req.params.name, function(err,data){
        res.setHeader('Content-Type', 'application/json');
        if(err){
            res.status(400).send(err);
        }
        res.send(JSON.stringify(data));
    });
});

app.post("/:name", function(req, res){
    cr.SaveList(req.params.name,req.body, function(err){
        res.setHeader('Content-Type', 'application/json');

        if(!err){
            res.send(JSON.stringify({message:"Updated Succeed"}));
            return;
        }
        res.status(400).send(JSON.stringify({message:"Updated failed"}));
    });
});
try{
var server = app.listen(port, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)

})
}
catch(ex){
  console.log(ex);
}
