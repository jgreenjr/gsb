var _ = require('lodash');

exports.CreateNewGenerator = function (trans, bank) {
    this.trans = trans;

    this.Generate = function (startDate, endDate) {
        var tw = 0;
        var td = 0;
        var tg = 0;
        var twc = 0;
        var tdc = 0;
        var tc = 0;

        var byCategory = _.map(bank.Categories, function (x) {
            return {
                Category: x.Text,
                Type: x.Type,
                Budget: x.Amount,
                TotalTransactions: 0,
                WithdrawlsCount:0,
                DepositsCount:0,
                Withdrawals:0,
                Deposits:0,
                Gains: 0,
                Active: x.Active
            };
        });

        for (var i = 0; i < trans.length; i++) {
            var amount = parseInt(trans[i].Amount);
            if (!startDate || (trans[i].Date >= startDate &&trans[i].Date < endDate) ) {
                tc++;
                switch (trans[i].Type) {
                case 'withdrawal':
                    twc++

                    tw += amount
                    AddCategory(trans[i], byCategory, false);
                    break;
                case 'deposit':
                    tdc++;
                    td += amount

                    AddCategory(trans[i], byCategory, true);
                    break;
                }
            }
        }

        return {
            date: new Date().toDateString(),
            TotalWithdrawls: tw,
            TotalWithdrawlsCount: twc,
            TotalDeposits: td,
            TotalDepositsCount: tdc,
            TotalGains: td - tw,
            TotalTransactions: tc,
            ByCategory: byCategory
        };
    }

    function AddCategory (transaction, obj, isDeposit) {

        for (var i = 0; i < obj.length; i++)
        {
            if (obj[i].Category == transaction.Category) {
                switch(transaction.Type)
                {
                    case "withdrawal":
                        obj[i].Withdrawals += transaction.Amount;
                        obj[i].Gains -= transaction.Amount;
                        obj[i].WithdrawlsCount++;
                        break;
                    case "deposit":
                        obj[i].Deposits += transaction.Amount;
                        obj[i].Gains += transaction.Amount;
                        obj[i].DepositsCount++;
                        break;
                }
               
                obj[i].TotalTransactions += 1;
               
                return;
            }
        }
       var category = {
           Category: transaction.Category,
           TotalTransactions: 1
       }
         switch(transaction.Type)
                {
                    case "withdrawal":
                        category.Deposits = 0;
                        category.Withdrawals = transaction.Amount;
                        category.Gains = 0 - transaction.Amount;
                        category.WithdrawlsCount = 1;
                        category.DepositsCount = 0;
                        break;
                    case "deposit":
                        category.Deposits = transaction.Amount;
                         category.Withdrawals = 0
                        category.Gains = transaction.Amount;
                        category.DepositsCount = 1
                         category.WithdrawlsCount = 0
                        break;
                }
               // category.Gains = amount;
               

        obj.push(category);
    }

    return this;
}
