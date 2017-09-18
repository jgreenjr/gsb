var Plan = require('../Models/Plan.js')
var Transaction = require('../Models/Transaction.js');
var _ = require('lodash');
module.exports = {
    GetPlans: function (userId, callback) {
        if (userId) {
            return Plan.find({'UserId': userId}, function (err, data) {
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

    GetPlan: function (userId, planId, cb) {
        if (!planId) {
            return cb({errorCode: 400, 'message': 'Must send planId'});
        } else if (!userId) {
            return cb({errorCode: 400, message: 'Must send UserId'});
        }

        return Plan.findOne({'_id': planId, 'UserId': userId}, function (err, plan) {
            if (err) {
                return cb(err);
            }
            if (!plan) {
                return cb({'err': 'Not found'});
            }
            return cb(null, plan);
        });
    },
    GeneratePlan: function (userId, planId, bankId, startdate, days, AutoPopulate, cb) {
        if (!planId) {
            return cb({errorCode: 400, 'message': 'Must send planId'});
        } else if (!userId) {
            return cb({errorCode: 400, message: 'Must send UserId'});
        }

        return Plan.findOne({'_id': planId, 'UserId': userId}, function (err, plan) {
            var planResult = {transactions: [], warnings: []};
            
            if (err) {
                return cb(err);
            }
            if (!plan) {
                return cb('NotFound');
            }
            if (plan.AutoPopulate && AutoPopulate) {
                days = 30;
            }
            else if (!days){
                return cb(null, planResult);
            }
            
            var date = new Date(startdate);
            var ids = [];
            for (var i = 0; i < days; i++) {
                for (var j = 0; j < plan.PlannedTransactions.length; j++) {
                    var trans = plan.PlannedTransactions[j];
                    var id = (date.getMonth() + 1) + '' + date.getDate() + '' + date.getFullYear() + KillSpaces(trans.Payee);
                    if (IsValidDate(trans, date)) {
                        planResult.transactions.push({
                            PlannedTransactionId: id,
                            Payee: trans.Payee,
                            Date: (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear(),
                            Amount: trans.Amount,
                            Type: trans.Type,
                            Status: 'Pending',
                            Category: trans.Category
                        });
                        ids.push(id);
                    }
                }
                date.setDate(date.getDate() + 1);
            }
            Transaction.find({Bank: bankId, PlannedTransactionId: {$in: ids}}, function (err, trans) {
                if (err) {
                    return cb(err);
                }
                planResult.transactions = _.differenceBy(planResult.transactions, trans, 'PlannedTransactionId');
                planResult.TransactionCount = planResult.transactions.length;
                cb(null, planResult);
            });
        });
    },
    InsertPlan: function (userId, plan, cb) {
        var p = new Plan();
        p.PlannedTransactions = plan.PlannedTransactions;
        p.Name = plan.Name
        p.UserId = userId;
        p.AutoPopulate = false;
        p.save(function (err, data) {
            cb(err, data);
        });
    },
    UpdatePlan: function (userId, planId, plan, cb) {
        Plan.findOne({'_id': planId}, function (err, data) {
            if (err) {
                return cb(err);
            }
            data.PlannedTransactions = plan.PlannedTransactions;
            data.AutoPopulate = plan.AutoPopulate;
            data.save(cb);
        });
    }
};

function IsValidDate (trans, date) {
    var startDate = new Date(trans.StartDate);
    if (date < startDate) {
        return false;
    }

    switch (trans.RepeatUnit) {
    case 'day':
        var time = date - startDate;
        var day = Math.floor(time / 86400000);

        return (day % trans.RepeatFrequency) === 0;
    case 'month':
        var xDay = date.getDate();
        var yDay = startDate.getDate();

        var xMonth = date.getMonth();
        var yMonth = startDate.getMonth();

        var monthDiff = yMonth - xMonth;

        return (xDay === yDay && monthDiff % trans.RepeatFrequency === 0);
    }

    return false;
}

function KillSpaces (str) {
    var result = '';
    if(str == undefined)
    {
        return '';
    }
    for (var i = 0; i < str.length; i++) {
        if (str[i] !== ' ') {
            result += str[i];
        }
    }

    return result;
}
