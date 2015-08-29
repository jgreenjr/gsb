/**
 * Created by greenj on 6/27/15.
 */
app.directive("menuBar", ["$http", "$cookies", "FilterService", function($http,$cookies, FilterSerivce){
    return {
        restrict:"E",

        "templateUrl":"directives/menu-bar.html",
        controller: function($scope, DataShareService){

            $scope.showPending = true;
            $scope.showCleared = true;
            $scope.showFutureItems = true;

            $scope.menuBarData = {username: "asdf", banks: []};
            $http.get("/banks").success(function(data){
                $scope.menuBarData = data;
                $scope.menuBarData.selectedBank = $cookies.defaultBank;
                DataShareService.selectedBankUpdated( $cookies.defaultBank);
            });

            this.updateDisplay = function(type){
                switch(type){
                    case "showPending":
                        $scope.showPending = !$scope.showPending;
                        FilterSerivce.updateShowPending($scope.showPending);
                        return false;
                    case "showCleared":
                        $scope.showCleared = !$scope.showCleared;
                        FilterSerivce.updateShowCleared($scope.showCleared);
                        return false;
                    case "showFutureItems":
                        $scope.showFutureItems = !$scope.showFutureItems;
                        alert($scope.showFutureItems);
                        FilterSerivce.updateShowFutureTransactions($scope.showFutureItems)
                }
                return false;
            }

            this.UpdateBankName = function(bankName){
                $scope.menuBarData.selectedBank = bankName;

                DataShareService.selectedBankUpdated(bankName);
            }

            $scope.OpenPopulatorWindow = function(){
               $("#planPopulatorModal").modal();
            }

            this.AddTransaction = function(){
                var currentDate = new Date();

                var dateStr = (currentDate.getMonth()+1)+"/"+currentDate.getDate()+"/"+currentDate.getFullYear();
                DataShareService.selectedTransactionUpdated({date: dateStr, Status:'Pending', type:'widthdrawl' })
                $("#transactionModal").modal();
                return false;
            }
        },
        controllerAs: "menuCtrl"
    };
}]);

app.directive('transactionBalance', function(){
    return {
        restrict: 'E',
        templateUrl: 'directives/transaction-balance.html'
    };
});

app.directive("statusFilters", function(){
    return {
        restrict: 'E',
        templateUrl: 'directives/Status-Filters.html'
    };
})

app.directive("accountSummary", function(){
    return {
        restrict: 'E',
        templateUrl: 'directives/account-summary.html'
    };
})

app.directive("transactionEditor", function(){
    return {
        restrict: 'E',
        templateUrl: 'directives/transaction-editor.html',
        //template: "<div>{{transactionObject.payee}}</div>",

        controller: function($scope, $http, DataShareService,TransactionSaveService){
            $scope.transactionObject = {};
                $scope.$on('selectedTransactionUpdated', function() {
                $scope.transactionObject = DataShareService.selectedTransaction;
            });

            $scope.$on('categoryDataUpdated', function(){
               $scope.Categories = DataShareService.categoryData;

            });

            this.SaveTransaction = function(){
                TransactionSaveService.SaveTransaction(DataShareService.selectedBank, $scope.transactionObject)
            }
        },
        controllerAs: "transactionCtrl"
    };
})


app.directive("planPopulator", function(){
    return {
        restrict: 'E',
        templateUrl: 'directives/plan-populator.html',
        controller: function($scope, $http, DataShareService, TransactionSaveService){
            $scope.DaysToProject = 28;
            $scope.LoadTransactions = function(){
                $http.get("/bankplan/"+$scope.selectedBank+"?Days="+$scope.DaysToProject).success(function(data){
                    $scope.FutureTransactions = data.transactions;
                })
            };

            $scope.SaveTransaction = function(transaction){
                TransactionSaveService.SaveTransaction(DataShareService.selectedBank, transaction)
            }
            $scope.$on("selectedBankUpdated", function(){
                $scope.selectedBank = DataShareService.selectedBank;
                $scope.LoadTransactions();
            })
            $scope.$on("TransactionUpdated",  $scope.LoadTransactions);
        }
    };
})