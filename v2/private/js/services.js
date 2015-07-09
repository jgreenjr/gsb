/**
 * Created by greenj on 7/3/15.
 */
app.factory("DataShareService", function($rootScope){
    var service = {};
    service.selectedBank = "";
    service.selectedTransaction = "";

    service.selectedBankUpdated = function(value){
        this.selectedBank = value;
        $rootScope.$broadcast("selectedBankUpdated");
    }

    service.selectedTransactionUpdated = function(value){
        this.selectedTransaction = value;
        $rootScope.$broadcast("selectedTransactionUpdated");
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
