/**
 * Created by greenj on 7/3/15.
 */
app.controller("BankController",["DataShareService","$http", "$scope", "TransactionSaveService", "FilterService",function(DataShareService,$http, $scope, TransactionSaveService, FilterService){
    $scope.showCurrent = false;
    $scope.pending = true;
    $scope.cleared = true;

    this.GetCategories = function()
    {
        var settings =  {method: 'get',
            url: '/categories/'+ this.selectedBank,
            headers: {
                'bank':this.selectedBank
            }
        }

        $http(settings).success(function(data){

            $scope.Categories = data;
            DataShareService.updateCategoryData(data);
    }).error(function(){

        });
    }

    parent = this;
    this.SwitchShowCurrent = function(){
        $scope.showCurrent = !$scope.showCurrent;
    }

    this.showPending = function() {
        $scope.pending = !$scope.pending;

    }
    this.showCleared = function(){
        $scope.cleared = !$scope.cleared;
    }

    this.filteredTransactions = function(transaction){
        return (transaction.Status == "Cleared" && $scope.cleared)||
            (transaction.Status == "Pending" && $scope.pending)
    }

    this.EditTransaction = function (transaction){
        DataShareService.selectedTransactionUpdated(transaction);
        $("#transactionModal").modal();
    }

    this.UpdateStatus = function(transaction){
        if(transaction.Status != 'Cleared' ) {
            transaction.Status = 'Cleared'
        }
        else{
            if(confirm("Are You Sure you want to Pend " + transaction.payee + "?"))
            transaction.Status = 'Pending'
        }
        parent.UpdateTransaction(transaction);
    }

    this.ShowStatusDialog = function(){
        $("#statusFilterModal").modal();
    }

    $scope.$on("filteringUpdated", function(){
        $scope.cleared = FilterService.showCleared
        $scope.pending = FilterService.showPending;
    })

    $scope.$on('selectedBankUpdated', function() {

        parent.selectedBank = DataShareService.selectedBank;;
        parent.GetCategories();
        parent.GetTransactions();
    });

    $scope.$on('TransactionUpdated', function() {
        parent.GetTransactions();
        $("#transactionModal").modal("hide");
    });

    this.UpdateTransaction = function(transaction){
        TransactionSaveService.SaveTransaction(parent.selectedBank, transaction);
    }

    this.GetTransactions = function(){
        var settings =  {method: 'get',
            url: '/banks/'+ this.selectedBank+"?PageNumber=1&StatusFilter=&CategoryFilter=&ShowFutureItems=true",
            headers: {
            'bank':this.selectedBank
            }
        }

        $http(settings).success(function(data){
            parent.Transactions = data.Transactions;
            parent.Total = data.Total;
        }).error(function(arg1, arg2){
            console.log(arg1);
            console.log(arg2);
        });
    }
}]);

app.filter('statusCheckMark', function() {
    return function(input) {
        return input == 'Cleared' ? '\u2713' : '\u2718';
    };
});

app.filter('filterCheckmark', function() {
    return function(input) {
        return input ? '\u2713' : '';
    };
});

var bankResponse = {"Transactions":[{"payee":"test transaction 4","date":"6/17/2015","amount":"44.22","type":"widthdrawl","Status":"Pending","InsertDate":"2015-06-17 14:17:11","UpdateDate":"","category":"Not Specified","id":"115_5_17_14_17_11_369","balance":{"ActualBalance":700.51,"ClearedBalance":-255.27,"FutureBalance":0}},{"payee":"test transaction 3","date":"6/17/2015","amount":"55.27","type":"widthdrawl","Status":"Cleared","InsertDate":"2015-06-17 14:16:59","UpdateDate":"","category":"Not Specified","id":"115_5_17_14_16_59_410","balance":{"ActualBalance":744.73,"ClearedBalance":-255.27,"FutureBalance":0}},{"payee":"test transaction 2","date":"6/17/2015","amount":"200.00","type":"widthdrawl","Status":"Cleared","InsertDate":"2015-06-17 14:16:44","UpdateDate":"","category":"Not Specified","id":"115_5_17_14_16_44_581","balance":{"ActualBalance":800,"ClearedBalance":-200,"FutureBalance":0}},{"payee":"asdf","date":"6/17/2015","amount":"1000.00","type":"deposit","Status":"Pending","InsertDate":"2015-06-17 14:16:32","UpdateDate":"","category":"Not Specified","id":"115_5_17_14_16_32_728","balance":{"ActualBalance":1000,"ClearedBalance":0,"FutureBalance":0}}],"Total":{"ActualBalance":700.51,"ClearedBalance":-255.27,"FutureBalance":0}};
