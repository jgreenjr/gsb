var express = require('express');
var Budgets = require('../Models/Budgets.js');
var transactionModel = require('../Models/Transaction.js');
var BudgetService = require('../Services/BudgetService.js')(Budgets, transactionModel);

var getRoute = function (budgetService) {
    BudgetService = budgetService || BudgetService;
    return express.Router()
        .get('/', function (req, res) {
            BudgetService.GetAllBudgetSheets(req.user._id, function (err, data) {
                res.send(err || data);
            });
        })
        .post('/:sheetId', function (req, res) {
            BudgetService.UpdateBudgetSheet(req.user._id, req.params.sheetId, req.body, function (err, data) {
                res.send(err || data);
            });
        })
     .get('/:sheetId', function (req, res) {
         BudgetService.GetBudgetSheet(req.user._id, req.params.sheetId, function (err, data) {
             res.send(err || data);
         });
     })

        .put('/', function (req, res) {
            req.body.UserId = req.user._id;
            BudgetService.CreateBudgetSheet(req.body, function (err, data) {
                res.send(err || data);
            });
        })
        .put('/:sheetId', function (req, res) {
            BudgetService.AddBudget(req.user._id, req.params.sheetId, req.body, function (err, data) {
                res.send(err || data);
            });
        })
        .post('/:sheetId/:budgetId', function (req, res) {
            BudgetService.UpdateBudget(req.user._id, req.params.sheetId, req.params.budgetId, req.body, function (err, data) {
                res.send(err || data);
            });
        })
        .delete('/:sheetId/:budgetId', function (req, res) {
            BudgetService.DeleteBudget(req.user._id, req.params.sheetId, req.params.budgetId, function (err, data) {
                res.send(err || data);
            });
        })
        .put('/:sheetId/:budgetId/Action', function (req, res) {
            BudgetService.AddActionToBudget(req.user._id, req.params.sheetId, req.params.budgetId, req.body, function (err, data) {
                res.send(err || data);
            });
        })
        .put('/:sheetId/:budgetId/Transaction', function (req, res) {
            BudgetService.AddTransactionToBudget(req.user._id, req.params.sheetId, req.params.budgetId, req.body, function (err, data) {
                res.send(err || data);
            });
        });
};

module.exports = getRoute;
