var express = require('express');
var BankService = require('../Services/BankService.js')

module.exports = function (AuthenticationService, bankService) {
    BankService = bankService || BankService;
    return express.Router()
        .get('/:bankId', function (req, res) {
            var sd = '';
            var ed = '';
            if (req.query.startDate) {
                sd = new Date(req.query.startDate);
                ed = new Date(req.query.endDate);
            }
            BankService.GetSummary(req.params.bankId, req.user._id, sd, ed, function (err, bank) {
                res.send(err || bank);
            });
        });
}