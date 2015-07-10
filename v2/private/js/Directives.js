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
                }
                return false;
            }

            this.UpdateBankName = function(bankName){
                $scope.menuBarData.selectedBank = bankName;

                DataShareService.selectedBankUpdated(bankName);
            }

            this.AddTransaction = function(){
                var currentDate = new Date();

                var dateStr = (currentDate.getMonth()+1)+"/"+currentDate.getDate()+"/"+currentDate.getFullYear();
                DataShareService.selectedTransactionUpdated({date: dateStr})
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