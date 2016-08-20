/**
 * Created by greenj on 8/14/16.
 */
var express = require('express');

var Bank = require('../Models/Bank.js');
var Transaction = require('../Models/Transaction.js');
var BalanceCalculatorService = require('../Services/BalanceCalculatorService.js');
var BankService = require('../Services/BankService.js')(Bank, Transaction,BalanceCalculatorService);

module.exports =  function(AuthenticationService){
    return express.Router()
        .get("/",function(req, res){
            BankService.GetAll(req.user._id, function(err, banks){
                if(err){
                    res.status(400).send(err);
                }
                else{
                    res.send(banks);
                }
            })
        })
        .put("/", function(req, res) {
            BankService.Create(req.body.Name, req.user._id, function(err,message){
                res.send(err||message);
            })
        })
        .get('/:bankId', function(req, res){
            BankService.Get(req.params.bankId, req.user._id,function(err, bank){
                res.send(err||bank);
            })
        })
        .put('/:bankId', function(req, res){
           BankService.AddTransaction(req.params.bankId, req.body, function(err, Transaction){
               res.send(err||Transaction)
           })
        });
 };