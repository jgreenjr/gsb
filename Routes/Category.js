var express = require('express');
var BankService = require('../Services/BankService.js');

module.exports = express.Router()
    .get('/:bankId', function (req, res) {
        BankService.GetCategories(req.params.bankId, req.user._id, function (err, bank) {
            res.send(err || bank);
        });
    })
    .post('/:bankId', function (req, res) {
        BankService.UpdateCategories(req.params.bankId, req.user._id, req.body, function (err, bank) {
            if (err) {
                res.send(400);
            }
            res.send(err || bank);
        });
    });