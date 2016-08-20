'use restrict'

var mongoose = require('mongoose');
var db = mongoose.createConnection('mongodb://localhost/greensavingsblown');

var express = require('express');
var _ = require('lodash');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var Action = new Schema({
   Name: String,
    Id: ObjectId,
    Amount: Double,
    Type: String
});

var budget = new Schema({
    BudgetName: String,
    Id:ObjectId,
    Transactions:[ObjectId],
    Actions:[Action]
});

var budgetSheet = new Schema({
    Name: String,
    Id: String,
    UserId: String,
    StartDate: Date,
    EndDate: Date
})
var model  = db.model('budgetSheet', budgetSheet);


var getRoute  = function(){
    var getAll = function(req, res){
      model.find({},function(err, data){
          res.send(_.map(data, ['Name', 'Id']));
      })
    };

    return express.Router()
        .get("/", getAll);
};


module.exports = getRoute();