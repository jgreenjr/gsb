var _ = require('lodash');
var util = require('util');

module.exports = function (Models, transactionModel) {
    return {
        GetAllBudgetSheets: function (userId, callback) {
            Models.find({'UserId': userId}, function (err, data) {
                if (err) {
                    return callback(err);
                }
                var returnData = _.map(data, function (b) {
                    return {
                        Name: b.Name,
                        BudgetSheetId: b._id
                    };
                });
                return callback(null, returnData);
            });
        },
        CreateBudgetSheet: function (budgetSheet, callback) {
            new Models(budgetSheet).save(function (err) {
                if (err) {
                    return callback({Error: 'Error Saving Budget Sheet'});
                }
                return callback(null, {Message: 'BudgetSheet Added'});
            });
        },
        UpdateBudgetSheet: function (userId, budgetSheetId, budgetSheet, callback) {
            Models.findOne({'UserId': userId, '_id': budgetSheetId}, function (err, data) {
                if (err || !data) {
                    return callback({'Error': 'Error Getting budget'}, null);
                }

                data.Banks = budgetSheet.Banks;
                data.Name = budgetSheet.Name;
                data.StartDate = budgetSheet.StartDate;
                data.EndDate = budgetSheet.EndDate;
                data.save(function (err2) {
                    if (err2) {
                        return callback({'Error': 'Error saving budget'});
                    }
                    callback({Message: 'Budget Updated'});
                });
            });
        },
        GetBudgetSheet: function (userId, budgetSheetId, callback) {
            Models.findOne({'UserId': userId, '_id': budgetSheetId}, function (err, data) {
                if (err || !data) {
                    return callback({'Error': 'Error Getting budget'}, null);
                }

                var findQuery = {'$or': []};
                _.each(data.Banks, function (bank) {
                    findQuery.$or.push({'Bank': bank});
                });
                transactionModel.find(findQuery, function (err, data2) {
                    if (err) {
                        return callback(err);
                    }
                    var BudgetCalculatorService = require('../Services/BudgetCalculatorService.js')();

                    data = BudgetCalculatorService.Calculate(data, data2);
                    callback(null, data);
                });
            });
        },
        AddBudget: function (userId, bankSheetId, budget, callback) {
            Models.findOne({'UserId': userId, '_id': bankSheetId}, function (err, data) {
                if (err || !data) {
                    return callback({'Error': 'Error Getting Bank'}, null);
                }
                data.Budgets.push(budget);
                data.save(function () {
                    if (err) {
                        return callback(err);
                    }

                    return callback(null, {Message: 'Budget Added'});
                });
            });
        },
        UpdateBudget: function (userId, bankSheetId, budgetId, budgetData, callback) {
            Models.findOne({'UserId': userId, '_id': bankSheetId}, function (err, data) {
                if (err || !data) {
                    return callback({'Error': 'Error Getting Bank'}, null);
                }
                var budget = _.find(data.Budgets, function (b) {
                    return b._id && b._id.toString() === budgetId.toString();
                });
                if (!budget) {
                    return callback({'Error': 'Budget Not Found'});
                }
                budget.BudgetName = budgetData.BudgetName;
                budget.budgeted = budgetData.budgeted;

                data.save(function (err) {
                    if (err) {
                        callback({'Error': 'Error Saving Action'});
                    } else {
                        callback(null, {Message: 'Action Added'});
                    }
                });
            });
        },
        DeleteBudget: function (userId, bankSheetId, budgetId, callback) {
            Models.findOne({'UserId': userId, '_id': bankSheetId}, function (err, data) {
                if (err || !data) {
                    return callback({'Error': 'Error Getting Bank'}, null);
                }
                _.remove(data.Budgets, function (b) {
                    return b._id && b._id.toString() === budgetId.toString();
                });

                data.save(function (err) {
                    if (err) {
                        callback({'Error': 'Error Saving Action'});
                    } else {
                        callback(null, {Message: 'Action Added'});
                    }
                });
            });
        },
        AddActionToBudget: function (userId, bankSheetId, budgetId, action, callback) {
            Models.findOne({'UserId': userId, '_id': bankSheetId}, function (err, data) {
                if (err || !data) {
                    return callback({'Error': 'Error Getting Bank'}, null);
                }

                var budget = _.find(data.Budgets, function (b) {
                    return b._id && b._id.toString() === budgetId.toString();
                });

                if (!budget) {
                    return callback({'Error': 'Budget Not Found'});
                }

                budget.Actions.push(action);
                data.save(function (err) {
                    if (err) {
                        callback({'Error': 'Error Saving Action'});
                    } else {
                        callback(null, {Message: 'Action Added'});
                    }
                });
            });
        },
        AddTransactionToBudget: function (userId, bankSheetId, budgetId, transactionId, callback) {
            Models.findOne({'UserId': userId, '_id': bankSheetId}, function (err, data) {
                if (err || !data) {
                    return callback({'Error': 'Error Getting Bank'}, null);
                }

                var budget = _.find(data.Budgets, function (b) {
                    return b._id && b._id.toString() === budgetId;
                });

                if (!budget) {
                    return callback({'Error': 'Budget Not Found'});
                }

                budget.Transactions.push(transactionId);
                data.save(function (err) {
                    if (err) {
                        callback({'Error': 'Error Saving Action'});
                    } else {
                        callback(null, {Message: 'Transaction Added'});
                    }
                });
            });
        },
        TransferBetweenBudgets: function (userId, sheetId, sourceBudgetId, targetBudgetId, amount, cb) {
            Models.findOne({'UserId': userId, '_id': sheetId}, function (err, data) {
                if (err || !data) {
                    return cb({'Error': 'Error Getting Bank'}, null);
                }

                var sourceBudget = _.find(data.Budgets, function (b) {
                    return b._id && b._id.toString() === sourceBudgetId;
                });

                if (!sourceBudget) {
                    return cb({'Error': 'Budget Not Found'});
                }

                var targetBudget = _.find(data.Budgets, function (b) {
                    return b._id && b._id.toString() === targetBudgetId;
                });

                if (!targetBudget) {
                    return cb({'Error': 'Budget Not Found'});
                }
                var name = util.format('Transfer from %s to %s', sourceBudget.Name, targetBudget.Name);

                targetBudget.Actions.push({
                    Name: name,
                    Type: 'In',
                    Amount: amount
                });

                sourceBudget.Actions.push({
                    Name: name,
                    Type: 'Out',
                    Amount: amount
                });

                data.save(function (err) {
                    if (err) {
                        cb({'Error': 'Error Saving Action'});
                    } else {
                        cb(null, {Message: 'Transfer Added'});
                    }
                });
            });
        }
    };
};
