/**
 * Created by greenj on 7/3/15.
 */
app.controller("BankController",["DataShareService","$http", "$scope", "TransactionSaveService", "FilterService",function(DataShareService,$http, $scope, TransactionSaveService, FilterService){
   $scope.filters = FilterService.filters;
    $scope.currentDate = new Date();

    var dateStr = ($scope.currentDate.getMonth()+1)+"/"+$scope.currentDate.getDate()+"/"+$scope.currentDate.getFullYear();
    $scope.currentDateObj = new Date(dateStr);
    $scope.budgetEndAmount = "";
    $scope.GetCategories = function()
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

    $scope.SwitchShowCurrent = function(){
        $scope.showCurrent = !$scope.showCurrent;
    }

    $scope.showPending = function() {
        $scope.pending = !$scope.pending;

    }
    $scope.showCleared = function(){
        $scope.cleared = !$scope.cleared;
    }

    $scope.filteredTransactions = function(transaction){
        tDt = new Date(transaction.date);
        bSD = new Date($scope.startDate);
        bED = new Date($scope.endDate);
        todayDate = new Date(dateStr)
        sevenDays = new Date(todayDate);
        sevenDays.setDate(todayDate.getDate()+7);

        if(tDt <= bED && $scope.budgetEndAmount == ""){
            $scope.budgetEndAmount = transaction.balance.ActualBalance;
        }

        if($scope.filters.showNeedsTips){
            return transaction.TipNeeded;

        }
        if($scope.filters.showBudgetItems){
            if(tDt > bED || tDt < bSD){
                return false;
            }
        }

        if($scope.filters.categoryFilter && transaction.category != $scope.filters.categoryFilter)
            return false;


//        console.log(tDt <= sevenDays && $scope.filters.showNextSevenDays);

        return ((transaction.Status == "Cleared" && $scope.filters.showCleared)||
            (transaction.Status == "Pending" && $scope.filters.showPending)) &&
        (tDt <=  todayDate || $scope.filters.showFutureTransaction ||
        (tDt <= sevenDays && $scope.filters.showNextSevenDays));
    }

    $scope.EditTransaction = function (transaction){
        DataShareService.selectedTransactionUpdated(transaction);
        $("#transactionModal").modal();
    }

    $scope.UpdateStatus = function(transaction) {
        if (transaction.Status != 'Cleared') {
            transaction.Status = 'Cleared'
        }
        else {
            if (confirm("Are You Sure you want to Pend " + transaction.payee + "?"))
                transaction.Status = 'Pending'
        }
        $scope.UpdateTransaction(transaction);

    }

    $scope.UpdateFlag = function(transaction){
      transaction.TipNeeded = !transaction.TipNeeded;
        $scope.UpdateTransaction(transaction);
    }

    $scope.ShowStatusDialog = function(){
        $("#statusFilterModal").modal();
    }

    $scope.$on("filteringUpdated", function(){
        $scope.filters = FilterService.filters;
        $scope.showCurrent = FilterService.filters.showCurrentBalance;
    })

    $scope.$on('selectedBankUpdated', function() {

        $scope.selectedBank = DataShareService.selectedBank;;
        $scope.dateIsOld = new Date(DataShareService.selectedBudgetEndDate) < new Date();
        $scope.GetCategories();
        $scope.GetTransactions();
        $scope.OnlineBalance = "";
    });

    $scope.$on('TransactionUpdated', function() {
        $scope.GetTransactions();
        $scope.GetCategories();
        $("#transactionModal").modal("hide");
    });

    $scope.UpdateTransaction = function(transaction){
        TransactionSaveService.SaveTransaction($scope.selectedBank, transaction);
    }

    $scope.DeleteTransaction = function(transaction){
        if(!confirm("Are you sure you want to delete " + transaction.payee +"?")) {
            return
        }
        $http.delete("/banks/" + $scope.selectedBank + "/" + transaction.id, {headers: { "accept": "application/json"}, responseType:"json"}).success(function(data){
            $scope.GetTransactions();
            $scope.$broadcast("TransactionUpdated");
        })
    };

    $scope.GetTransactions = function(){
        var settings =  {method: 'get',
            url: '/banks/'+ this.selectedBank+"?PageNumber=1&StatusFilter=&CategoryFilter=&ShowFutureItems=true",
            headers: {
            'bank':this.selectedBank
            }
        }

        $http(settings).success(function(data){
            $scope.Transactions = data.Transactions;
            $scope.Total = data.Total;
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

app.filter('shortText', function(){
    return function(input) {
        return input.substr(0, 8);
    };
})

var bankResponse = {"Transactions":[{"payee":"test transaction 4","date":"6/17/2015","amount":"44.22","type":"widthdrawl","Status":"Pending","InsertDate":"2015-06-17 14:17:11","UpdateDate":"","category":"Not Specified","id":"115_5_17_14_17_11_369","balance":{"ActualBalance":700.51,"ClearedBalance":-255.27,"FutureBalance":0}},{"payee":"test transaction 3","date":"6/17/2015","amount":"55.27","type":"widthdrawl","Status":"Cleared","InsertDate":"2015-06-17 14:16:59","UpdateDate":"","category":"Not Specified","id":"115_5_17_14_16_59_410","balance":{"ActualBalance":744.73,"ClearedBalance":-255.27,"FutureBalance":0}},{"payee":"test transaction 2","date":"6/17/2015","amount":"200.00","type":"widthdrawl","Status":"Cleared","InsertDate":"2015-06-17 14:16:44","UpdateDate":"","category":"Not Specified","id":"115_5_17_14_16_44_581","balance":{"ActualBalance":800,"ClearedBalance":-200,"FutureBalance":0}},{"payee":"asdf","date":"6/17/2015","amount":"1000.00","type":"deposit","Status":"Pending","InsertDate":"2015-06-17 14:16:32","UpdateDate":"","category":"Not Specified","id":"115_5_17_14_16_32_728","balance":{"ActualBalance":1000,"ClearedBalance":0,"FutureBalance":0}}],"Total":{"ActualBalance":700.51,"ClearedBalance":-255.27,"FutureBalance":0}};
