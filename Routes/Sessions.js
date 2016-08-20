/**
 * Created by greenj on 8/13/16.
 */
var express = require('express');
var createRoute = function(passport, AuthenticationService){

   return express.Router()
        .get("/", AuthenticationService.IsAuthenticated, function(req, res){
            res.send(req.session);
        })
        .put("/", passport.authenticate('basic', {session:true}), function(req, res){
            res.send({'message': 'Success'});
        });
}

module.exports = createRoute;