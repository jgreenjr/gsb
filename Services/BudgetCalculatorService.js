var _ = require('lodash');

module.exports = function () {
    return {
        Calculate: function (budgetSheet, Transactions) {
            budgetSheet.summary = {
                income: {
                    budgeted: 0,
                    current: 0
                },
                debt: {
                    budgeted: 0,
                    current: 0
                }
            };

            _.each(budgetSheet.Budgets, function (budget) {
                budget.balance = BudgetBalance(budget, Transactions);
                if (budget.Type === 'Income') {
                    budget.balance.remaining = budget.budgeted - budget.balance.totalIn + budget.balance.totalOut;
                    budgetSheet.summary.income.budgeted += budget.budgeted;
                    budgetSheet.summary.income.current += budget.balance.totalIn;
                } else {
                    budget.balance.remaining = budget.budgeted + budget.balance.totalOut - budget.balance.totalIn;
                    budgetSheet.summary.debt.budgeted += budget.budgeted;
                    budgetSheet.summary.debt.current += budget.balance.totalOut;
                }
            });
            return budgetSheet;
        }
    };

    function BudgetBalance (budget, Transactions) {
        var balance = {
            totalIn: 0,
            totalOut: 0,
            difference: 0,
            remaining: 0
        };

        _.each(budget.Actions, function (action) {
            switch (action.Type) {
            case 'In':
                balance.totalIn += action.Amount;
                balance.difference += action.Amount;
                break;
            case 'Out':
                balance.totalOut += action.Amount;
                balance.difference -= action.Amount;
                break;
            }
        });

        _.each(budget.Transactions, function (action) {
            var t = _.find(Transactions, function (trans) {
                return trans._id && trans._id.toString() === action.TransactionId;
            });

            switch (t.Type) {
            case 'Deposit':
            case 'deposit':
                balance.totalIn += (t.Amount * action.Percentage);
                balance.difference += (t.Amount * action.Percentage);
                break;
            case 'withdrawal':
            case 'Withdrawal':
                balance.totalOut += (t.Amount * action.Percentage);
                balance.difference -= (t.Amount * action.Percentage);
                break;
            }
        });
        return balance;
    }
};
