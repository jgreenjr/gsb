/**
 * Created by greenj on 6/27/15.
 */
app.directive("menuBar", ["$http", "$cookies", function($http,$cookies){
    return {
        restrict:"E",

        "templateUrl":"directives/menu-bar.html",
        controller: function($scope, DataShareService){

            $scope.menuBarData = {username: "asdf", banks: []};
            $http.get("/banks").success(function(data){
                $scope.menuBarData = data;
                $scope.menuBarData.selectedBank = $cookies.defaultBank;
                DataShareService.selectedBankUpdated( $cookies.defaultBank);
            });

            this.UpdateBankName = function(bankName){
                $scope.menuBarData.selectedBank = bankName;

                DataShareService.selectedBankUpdated(bankName);
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

        controller: function($scope, $http, DataShareService){
            $scope.transactionObject = {};
            $scope.$on('selectedTransactionUpdated', function() {
                alert("transactionModal");
                $scope.transactionObject = DataShareService.selectedTransaction;
            });

            this.SaveTransaction = function(){
                alert(JSON.stringify(self.transactionObject));
            }
        },
        controllerAs: "transactionCtrl"
    };
})