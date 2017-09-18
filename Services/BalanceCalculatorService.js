var _ = require('lodash');

module.exports = function () {
    this.Balances = {
        ActualBalance: 0.00,
        CurrentBalance: 0.00
    };

    this.CalculateBalances = function (transactions) {
        var self = this;
        var returnValues = _.map(transactions, function (item) {
            return {
                id: item._id,
                Amount: item.Amount,
                Type: item.Type,
                Payee: item.Payee,
                Date: item.Date,
                Status: item.Status,
                Category: item.Category,
                FollowUp: item.FollowUp,
                Note: item.Note,
                Balance: {
                    ActualBalance: AddActualBalance(self, item),
                    CurrentBalance: AddCurrentBalance(self, item)
                }
            };
        });
        return returnValues;
    };

    function AddActualBalance (self, transaction) {
        var amount = transaction.Amount;
        if (transaction.Type !== 'Deposit' && transaction.Type !== 'deposit') {
            amount *= -1;
        }
        self.Balances.ActualBalance += amount;
        return self.Balances.ActualBalance;
    }

    function AddCurrentBalance (self, transaction) {
        var amount = transaction.Amount;
        if (transaction.Status !== 'Cleared') {
            return self.Balances.CurrentBalance;
        }
        if (transaction.Type !== 'Deposit' && transaction.Type !== 'deposit') {
            amount *= -1;
        }
        self.Balances.CurrentBalance += amount;
        return self.Balances.CurrentBalance;
    }

    return this;
};
