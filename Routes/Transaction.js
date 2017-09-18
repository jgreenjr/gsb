var express = require('express');
var BankService = require('../Services/BankService.js');

module.exports = function (AuthenticationService, bankService) {
    BankService = bankService || BankService;
    return express.Router()
         .put('/', function (req, res) {
             BankService.AddTransaction(req.body, function (err, Transaction) {
                 res.send(err || Transaction);
             });
         })
        .post('/:TransactionId', function (req, res) {
            BankService.UpdateTransaction(req.body, function (err, Transaction) {
                res.send(err || Transaction);
            });
        })
        .delete('/:BankId/:TransactionId', function (req, res) {
            BankService.DeleteTransaction(req.params.BankId, req.params.TransactionId, function (err) {
                res.send(err);
            })
        })
};