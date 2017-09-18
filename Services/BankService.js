var Bank = require('../Models/Bank.js');
var Transaction = require('../Models/Transaction.js');
var BalanceCalculatorService = require('../Services/BalanceCalculatorService.js');
var summaryGeneratorFactory = require('../SummaryGenerator.js')
var _ = require('lodash');

module.exports = {
    GetAll: function (userId, callback) {
        if (userId) {
            return Bank.find({'Users.UserId': userId}, function (err, data) {
                if (err) {
                    callback(err);
                } else if (!data) {
                    callback({message: 'No data found'});
                } else {
                    callback(null, data);
                }
            });
        }

        return callback({errorCode: 400, message: 'Must send UserId'});
    },
    Get: function (bankId, userId, cb) {
        if (!bankId) {
            return cb({errorCode: 400, 'message': 'Must send BankId'});
        } else if (!userId) {
            return cb({errorCode: 400, message: 'Must send UserId'});
        }

        return Bank.findOne({'_id': bankId, 'Users.UserId': userId}, function (err, bank) {
            if (err) {
                return cb(err);
            } else if (!bank) {
                return cb({message: 'BankID UserId set incorrect'});
            }

            Transaction.find({'Bank': bankId})
                .sort({'Date': '1', 'Order': 1})
                .exec(function (err, data) {
                    if (err) {
                        return cb(err);
                    }
                    var bcs = new BalanceCalculatorService();
                    var returnData = bcs.CalculateBalances(data);

                    var bankReturn = {
                        Title: bank.Name,
                        Transactions: returnData,
                        Balances: bcs.Balances
                    };
                    return cb(null, bankReturn);
                });
        });
    },
    Create: function (bankName, userId, cb) {
        var bank = new Bank();
        bank.Name = bankName;

        var bankUser = {
            UserId: userId,
            IsOwner: true,
            Categories: [{'Text': 'unclassified', 'Type': 'Unknown'}]
        };

        bank.Users.push(bankUser);

        bank.save(cb);
    },
    Post: function (bankId, bank, callback) {
        CheckForBank(bankId, callback, function (bankObj) {
            bankObj.Name = bank.Name;
            bankObj.BudgetStartDate
            bankObj.save(callback);
        });
    },
    AddTransaction: function (transactionData, callback) {
        CheckForBank(transactionData.bankId, callback, function (bank) {
            var transaction = new Transaction(transactionData);
            transaction.Bank = transactionData.bankId;
            UpdateCategoryList(bank, transaction.Category, function (err) {
                if (err) {
                    return callback(err)
                }
                transaction.save(function (err, data) {
                    return callback(err, data);
                });
            });
        });
    },
    UpdateTransaction: function (transactionData, callback) {
        CheckForBank(transactionData.bankId, callback, function (bank) {
            Transaction.findOne({'_id': transactionData.id}, function (err, transaction) {
                if (err) {
                    return callback(err);
                }

                if (!transaction) {
                    return callback({'error': 'notfound'});
                }

                transaction.Payee = transactionData.Payee;
                transaction.Type = transactionData.Type;
                transaction.Date = transactionData.Date;
                transaction.Amount = transactionData.Amount;
                transaction.Status = transactionData.Status;
                transaction.Bank = transactionData.bankId;
                transaction.Note = transactionData.Note;
                transaction.FollowUp = transactionData.FollowUp;
                transaction.Category = transactionData.Category;

                transaction.save(function (err) {
                    if (err) {
                        return callback(err);
                    }
                    UpdateCategoryList(bank, transaction.Category, callback);
                });
            });
        });
    },
    GetTransactionByPlannedTransactionId: function (bankId, transactionId, callback) {
        Transaction.findOne({'plannedTransactionId': transactionId}, callback);
    },
    GetSummary: function (bankId, userId, startDate, endDate, cb) {
        if (!bankId) {
            return cb({errorCode: 400, 'message': 'Must send BankId'});
        } else if (!userId) {
            return cb({errorCode: 400, message: 'Must send UserId'});
        }

        return Bank.findOne({'_id': bankId, 'Users.UserId': userId}, function (err, bank) {
            if (err) {
                return cb(err);
            } else if (!bank) {
                return cb({message: 'BankID UserId set incorrect'});
            }

            Transaction.find({'Bank': bankId})
                .sort({'Date': '1', 'Order': 1})
                .exec(function (err, data) {
                    if (err) {
                        return cb(err);
                    }
                    var bcs = new summaryGeneratorFactory.CreateNewGenerator(data, bank);
                    var returnData = bcs.Generate(startDate, endDate);

                    return cb(null, returnData);
                });
        });
    },
    GetCategories: function (bankId, userId, cb) {
        if (!bankId) {
            return cb({errorCode: 400, 'message': 'Must send BankId'});
        } else if (!userId) {
            return cb({errorCode: 400, message: 'Must send UserId'});
        }
        return Bank.findOne({'_id': bankId, 'Users.UserId': userId}, function (err, bank) {
            if (err) {
                return cb(err);
            }
            return cb(null, bank.Categories)
        });
    },
    UpdateCategories: function (bankId, userId, categoryData, cb) {
        CheckForBank(bankId, cb, function (bank) {
            bank.Categories = categoryData
            bank.save(cb);
        });
    },
    DeleteTransaction: function (bankId, TransactionId, callback) {
        Transaction.remove({'_id': TransactionId}, function (err) {
            callback(err, null);
        });
    }
};
function CheckForBank (BankId, callback, next) {
    Bank.findOne({'_id': BankId}, function (err, bank) {
        if (err || bank == null) {
            return callback('bank not found');
        }
        return next(bank);
    });
}
function UpdateCategoryList (bank, category, callback) {
    var cat = _.find(bank.Categories, {'Text': category})
    if (!cat) {
        bank.Categories.push({'Text': category, 'Type': 'Unknown'});
    }
    bank.save(callback)
}