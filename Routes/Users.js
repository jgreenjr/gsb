var User = require('../Models/User');
var UserServices = require("../Services/UserServices.js")(User);
var express = require('express');
var _ = require("lodash");

var buildRouter =  function(AuthenticationService){
    var route = express.Router();

    route
        .all("*", AuthenticationService.IsAuthenticated)
        .get('/',function(req, res){
       User.find({}, function(err, data){
          var returnData = _.map(data, function(d){
              return {
                  id: d.id
              };
          });
           res.send(returnData);
       });
    }).post('/', function(req, res){
       UserServices.CreateUser(req.body.email, req.body.password,req.body.defaultBank, function(err, msg){
           if(err){
               res.status(400).send(err);
               return;
           }
           res.status(201).send({"msg": "created"});
       } )
    }).get('/:id', function(req, res){
        UserServices.GetUser(req.param.email, function(err, data){
                if(err){
                    res.status(400).send(err);
                    return;
                }
                data.password = undefined
                data.Pin = undefined;
                res.status(200).send(data);
            }
        )
    }).post("/:id", function(req, res){

    })

    return route;
}

module.exports = buildRouter
