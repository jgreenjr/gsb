/**
 * Created by greenj on 7/3/15.
 */
app.controller('BankController', ['DataShareService', '$http', '$scope', 'TransactionSaveService', 'FilterService', '$rootScope', function (DataShareService, $http, $scope, TransactionSaveService, FilterService, $rootScope) {
    $scope.filters = FilterService.filters;
    $scope.currentDate = new Date();

    $scope.AutoAddTransactions = [];

    var dateStr = ($scope.currentDate.getMonth() + 1) + '/' + $scope.currentDate.getDate() + '/' + $scope.currentDate.getFullYear();
    $scope.currentDateObj = new Date(dateStr);
    $scope.budgetEndAmount = '';
    $scope.GetCategories = function () {
        var settings = {
            method: 'get',
            url: '/Category/' + $scope.selectedBankId,
            headers: {
                'bank': $scope.selectedBankId
            }
        }

        $http(settings).success(function (data) {
            $scope.Categories = data;
            DataShareService.updateCategoryData(data);
        }).error(function () {

        });
    }

    $scope.SwitchShowCurrent = function () {
        $scope.showCurrent = !$scope.showCurrent;
    }
    $scope.OpenConfiguration = function(){
        $("#CategoryEditor").modal();
    }

    $scope.showPending = function () {
        $scope.pending = !$scope.pending;
    }
    $scope.showCleared = function () {
        $scope.cleared = !$scope.cleared;
    }

    $scope.filteredTransactions = function (transaction) {

        todayDate = new Date(dateStr)
        sevenDays = new Date(todayDate);
        sevenDays.setDate(todayDate.getDate() + 7);
        tDt = new Date(transaction.Date);

        if ($scope.filters.FollowUp) {
            return transaction.FollowUp;
        }
        if ($scope.filters.showThisMonth) {
            var month = new Date().getMonth() + 1;
            var year = new Date().getFullYear();

            if (month == 13) {
                month = 1;
                year += 1;
            }
            var endMonth = month + 1;
            var endYear = year;
            if (endMonth == 13) {
                endMonth = 1;
                endYear += 1;
            }

            startDate = new Date(month + "/1/" + year);
            endDate = new Date(endMonth + "/1/" + endYear)
            return tDt < endDate && tDt >= startDate;
        }

        if ($scope.filters.categoryFilter && transaction.Category != $scope.filters.categoryFilter)
            return false;

        //        console.log(tDt <= sevenDays && $scope.filters.showNextSevenDays);

        return ((transaction.Status == 'Cleared' && $scope.filters.showCleared) ||
            (transaction.Status == 'Pending' && $scope.filters.showPending)) &&
            (tDt <= todayDate || $scope.filters.showFutureTransaction ||
                (tDt <= sevenDays && $scope.filters.showNextSevenDays));
    }

    $scope.EditTransaction = function (transaction) {
        DataShareService.selectedTransactionUpdated(transaction);
        $('#transactionModal').modal();
    }

    $scope.UpdateStatus = function (transaction) {
        if (transaction.Status != 'Cleared') {
            transaction.Status = 'Cleared'
        } else {
            if (confirm('Are You Sure you want to Pend ' + transaction.payee + '?'))
                transaction.Status = 'Pending'
        }
        $scope.UpdateTransaction(transaction);
    }

    $scope.UpdateFlag = function (transaction) {
        transaction.FollowUp = !transaction.FollowUp;
        $scope.UpdateTransaction(transaction);
    }

    $scope.ShowStatusDialog = function () {
        $('#statusFilterModal').modal();
    }

    $scope.$on('filteringUpdated', function () {
        $scope.filters = FilterService.filters;
        $scope.showCurrent = FilterService.filters.showCurrentBalance;
    })

    $scope.$on('selectedBankUpdated', function () {

        $scope.selectedBank = DataShareService.selectedBank;
        $scope.selectedBankId = DataShareService.selectedBankId;
        $scope.dateIsOld = false;// new Date(DataShareService.selectedBudgetEndDate) < new Date();
        $scope.GetCategories();
        $scope.GetTransactions();
        $scope.AutoPopulatePlan();
        $scope.OnlineBalance = '';
    });

    $scope.$on('planIdSet', function (planId, ar2) {
        $scope.PlanId = ar2;
        $scope.AutoPopulatePlan();
    });
  

    $scope.AutoPopulatePlan = function () {
        if ($scope.PlanId) {
            $http.get('/Plan/' + $scope.PlanId + "/" + $scope.selectedBankId + '?autoPopulate=true').success(function (data) {
                async.eachSeries(data.transactions, function (t, done) {
                    TransactionSaveService.SaveTransaction($scope.selectedBankId, t, done)
                }, function () {
                        $scope.GetTransactions()              
                    });
            })
        }
    }
    $scope.$on('TransactionUpdated', function () {
        $scope.GetTransactions();
        $scope.GetCategories();
        $('#transactionModal').modal('hide');
    });
    $scope.$on("AddedTransaction", function (event, data) {
        $scope.AutoAddTransactions.push(data);
    })



    $scope.UpdateTransaction = function (transaction) {
        TransactionSaveService.SaveTransaction($scope.selectedBankId, transaction);
    }

    $scope.DeleteTransaction = function (transaction) {
       /* if (!confirm('Are you sure you want to delete ' + transaction.payee + '?')) {
            return
        }
        $http.delete('/Transaction/' + $scope.selectedBankId + '/' + transaction.id, { headers: { 'accept': 'application/json' }, responseType: 'json' }).success(function (data) {
            $scope.GetTransactions();
            $scope.$broadcast('TransactionUpdated');
        })*/
      //  DataShareService.DeleteTransaction(transaction);
      $rootScope.$broadcast("TransactionDelete",$scope.selectedBankId,transaction)
    };

    $scope.GetTransactions = function () {
        var settings = {
            method: 'get',
            url: '/bank/' + this.selectedBankId,
            headers: {
                'bank': this.selectedBank
            }
        }

        $http(settings).success(function (data) {
            console.log(data.Transactions);
            $scope.Transactions = data.Transactions;
            $scope.Total = data.Balances;
        }).error(function (arg1, arg2) {
            console.log(arg1);
            console.log(arg2);
        });
    }
}]);

app.filter('statusCheckMark', function () {
    return function (input) {
        return input == 'Cleared' ? '\u2713' : '\u2718';
    };
});

app.filter('filterCheckmark', function () {
    return function (input) {
        return input ? '\u2713' : '';
    };
});

app.filter('shortText', function () {
    return function (input) {
        if (input)
            return input.substr(0, 8);
        return "huh";
    };
}).filter('reverse', function () {
    return function (items) {
        if (items) {
            return items.slice().reverse();
        }
    };
});

var bankResponse = { 'Transactions': [{ 'payee': 'test transaction 4', 'date': '6/17/2015', 'amount': '44.22', 'type': 'widthdrawl', 'Status': 'Pending', 'InsertDate': '2015-06-17 14:17:11', 'UpdateDate': '', 'category': 'Not Specified', 'id': '115_5_17_14_17_11_369', 'balance': { 'ActualBalance': 700.51, 'ClearedBalance': -255.27, 'FutureBalance': 0 } }, { 'payee': 'test transaction 3', 'date': '6/17/2015', 'amount': '55.27', 'type': 'widthdrawl', 'Status': 'Cleared', 'InsertDate': '2015-06-17 14:16:59', 'UpdateDate': '', 'category': 'Not Specified', 'id': '115_5_17_14_16_59_410', 'balance': { 'ActualBalance': 744.73, 'ClearedBalance': -255.27, 'FutureBalance': 0 } }, { 'payee': 'test transaction 2', 'date': '6/17/2015', 'amount': '200.00', 'type': 'widthdrawl', 'Status': 'Cleared', 'InsertDate': '2015-06-17 14:16:44', 'UpdateDate': '', 'category': 'Not Specified', 'id': '115_5_17_14_16_44_581', 'balance': { 'ActualBalance': 800, 'ClearedBalance': -200, 'FutureBalance': 0 } }, { 'payee': 'asdf', 'date': '6/17/2015', 'amount': '1000.00', 'type': 'deposit', 'Status': 'Pending', 'InsertDate': '2015-06-17 14:16:32', 'UpdateDate': '', 'category': 'Not Specified', 'id': '115_5_17_14_16_32_728', 'balance': { 'ActualBalance': 1000, 'ClearedBalance': 0, 'FutureBalance': 0 } }], 'Total': { 'ActualBalance': 700.51, 'ClearedBalance': -255.27, 'FutureBalance': 0 } };