/**
 * Created by greenj on 7/3/15.
 */
app.factory("DataShareService", function($rootScope){
    var service = {};
    service.selectedBank = "";
    service.selectedTransaction = "";
    service.categoryData = "";
    service.selectedBudgetStartDate = "1/1/2015";
    service.selectedBudgetEndDate = "1/1/2015";
    service.selectedBankUpdated = function(value){
        this.selectedBank = value.bankName;
        this.selectedBudgetStartDate = value.BudgetStartDate;
        this.selectedBudgetEndDate = value.BudgetEndDate
        $rootScope.$broadcast("selectedBankUpdated");
    }



    service.selectedTransactionUpdated = function(value){
        this.selectedTransaction = value;
        $rootScope.$broadcast("selectedTransactionUpdated");
    }

    service.updateCategoryData = function(value){
        this.categoryData = value;
        $rootScope.$broadcast("categoryDataUpdated");
    }

    return service;
});

app.factory("TransactionSaveService", function($http, $rootScope){
    var service = {};


    service.SaveTransaction = function(bank, transactionData){
        var method = "put";

        if(transactionData.id == undefined ){
            method = "post"
        }
        var settings =  {method: method,
            url: '/banks/'+ bank,
            headers: {
                'bank':bank,
                'content-type': 'text/json',
                'accept': "text/plain"
            },
            data: angular.toJson(transactionData)
        };
        $http(settings).success(function(data){
            $rootScope.$broadcast("TransactionUpdated");
        }).error(function(arg1, arg2){
            console.log(arg1, arg2)
        });
    };

    return service;
});


app.factory("FilterService", function($rootScope){
    var service = {};
    service.filters ={
        showPending: true,
        showCleared: true,
        showFutureTransaction: true,
        showNeedsTip: false,
        searchQuery: ""
    };

    service.updateShowPending = function(value){
        service.updateFilterSetting("showPending", value);
    }

    service.updateShowCleared = function(value){

        service.updateFilterSetting("showCleared", value);
    }

    service.updateShowFutureTransactions = function(value){
        service.updateFilterSetting("showFutureTransaction", value);
    }

    service.updateFilterSetting = function(key, value){
        service.filters[key] = value;
        $rootScope.$broadcast("filteringUpdated");
    }
    return service;
})