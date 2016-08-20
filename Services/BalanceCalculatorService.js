var _ = require('lodash');

module.exports = function(){

        this.Balances = {
            ActualBalance: 0.00,
            CurrentBalance: 0.00
        };

        this.CalculateBalances = function (transactions) {
            self = this;
            var returnValues = _.map(transactions, function(item){
                return {
                    Amount: item.Amount,
                    Balance: {
                        ActualBalance: AddActualBalance(self, item),
                        CurrentBalance: AddCurrentBalance(self, item)
                    }
                }
            });
            return returnValues;
        }

    function AddActualBalance(self, transaction){
        var amount = transaction.Amount;
        if(transaction.Type != 'Deposit'){
            amount *= -1
        }
        self.Balances.ActualBalance += amount;
        return self.Balances.ActualBalance;
    }
    function AddCurrentBalance(self, transaction){
        var amount = transaction.Amount;
        if(transaction.Status != "Cleared"){
            return  self.Balances.CurrentBalance
        }
        if(transaction.Type != 'Deposit'){
            amount *= -1
        }
        self.Balances.CurrentBalance += amount;
        return self.Balances.CurrentBalance;
    }

    return this;

}