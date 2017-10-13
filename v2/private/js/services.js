/**
 * Created by greenj on 7/3/15.
 */
app.factory('DataShareService', function ($rootScope) {
    var service = {};
    service.selectedBank = '';
    service.selectedTransaction = '';
    service.selectedBankId = '';
    service.categoryData = '';
    service.selectedBudgetStartDate = '1/1/2015';
    service.selectedBudgetEndDate = '1/1/2015';
    service.selectedBankUpdated = function (value) {
        if(value){
        this.selectedBank = value.Name;
        this.selectedBankId = value.bankId;
        }
        $rootScope.$broadcast('selectedBankUpdated');
    }

    service.BroadcastValue = function(key, value){
        $rootScope.$broadcast(key,value); 
    }

    service.PlanIdSet = function (value) {
        this.PlanId = value;
        $rootScope.$broadcast('planIdSet',value);
    }

    service.selectedTransactionUpdated = function (value) {
        this.selectedTransaction = value;
        $rootScope.$broadcast('selectedTransactionUpdated');
    }

    service.updateCategoryData = function (value) {
        this.categoryData = value;
        $rootScope.$broadcast('categoryDataUpdated');
    }

    service.DeleteTransaction = function(transaction){
        $rootScope.$broadcast("TransactionDelete",service.selectedBankId,transaction)
    }

    return service;
});

app.factory('TransactionSaveService', function ($http, $rootScope) {
    var service = {};

    service.SaveTransaction = function (bankId, transactionData, done) {
        var method = 'post';
        var url = "/"+transactionData.id
        transactionData.bankId = bankId;
        if (transactionData.id == undefined) {
            method = 'put'
            url = "";
        }
        var settings = {method: method,
            url: '/Transaction' + url,
            headers: {
                'content-type': 'application/json',
                'accept': 'application/json'
            },
            data: angular.toJson(transactionData)
        };
        $http(settings).success(function (data) {
            $rootScope.$broadcast("AddedTransaction", transactionData)
            if(done){ 
                return done();
            }
            $rootScope.$broadcast('TransactionUpdated');
        }).error(function (arg1, arg2) {
            console.log(arg1, arg2)
        });
    };

    return service;
});

app.factory('FilterService', function ($rootScope) {
    var service = {};
    service.filters = {
        showPending: true,
        showCleared: true,
        showFutureTransaction: true,
        showNeedsTips: false,
        searchQuery: '',
        showThisMonth: false,
        showCurrentBalance: false
    };

    service.updateShowPending = function (value) {
        service.updateFilterSetting('showPending', value);
    }

    service.updateShowCleared = function (value) {
        service.updateFilterSetting('showCleared', value);
    }

    service.updateShowFutureTransactions = function (value) {
        service.updateFilterSetting('showFutureTransaction', value);
    }

    service.updateFilterSetting = function (key, value) {
        service.filters[key] = value;
        $rootScope.$broadcast('filteringUpdated');
    }

    service.updateAllFilterSettings = function (newFilterSettings) {
        service.filters = newFilterSettings;
        $rootScope.$broadcast('filteringUpdated');
    }
    return service;
})
