/**
 * Created by greenj on 8/14/16.
 */
var express = require('express');
var _ = require('lodash');
var BankService = require('../Services/BankService.js');

module.exports = function (AuthenticationService, bankService) {
    BankService = bankService || BankService;
    return express.Router()
        .get('/', function (req, res) {
            BankService.GetAll(req.user._id, function (err, banks) {
                if (err) {
                    res.status(400).send(err);
                } else {
                    var returnValue = _.map(banks, function (a) {
                        return {bankId: a._id, Name: a.Name};
                    });
                    res.send(returnValue);
                }
            });
        })
        .put('/', function (req, res) {
            BankService.Create(req.body.Name, req.user._id, function (err, message) {
                res.send(err || message);
            });
        })
        .get('/:bankId', function (req, res) {
            BankService.Get(req.params.bankId, req.user._id, function (err, bank) {
                res.send(err || bank);
            });
        })
        .post('/:bankId', function (req, res) {
            BankService.UpdateBank(req.params.bankId, req.body, function (err, bank) {
                res.send(err || bank);
            });
        });
};
