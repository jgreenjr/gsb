/**
 * Created by greenj on 8/22/16.
 */
'use restrict';

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Action = new Schema({
    Name: String,
    Amount: Number,
    Type: String
});

var BankTransaction = new Schema({
    BankId: String,
    TransactionId: String,
    Percentage: Number
});

var Budget = new Schema({
    BudgetName: String,
    Transactions: [BankTransaction],
    Actions: [Action],
    balance: Object,
    budgeted: Number,
    TotalRemaining: Number,
    Type: String
});

var BudgetSheet = new Schema({
    Name: String,
    UserId: String,
    StartDate: Date,
    EndDate: Date,
    Budgets: [Budget],
    Banks: [String],
    summary: Object
});

module.exports = mongoose.model('budgetSheet', BudgetSheet);