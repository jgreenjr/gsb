/**
 * Created by greenj on 6/27/15.
 */
app.directive("menuBar", ["$http", "$cookies", function($http,$cookies){
    return {
        restrict:"E",

        "templateUrl":"directives/menu-bar.html",
        controller: function($scope, $injector){
            var SharedDataService = $injector.get("SharedDataService");
            $scope.menuBarData = {username: "asdf", banks: []};
            $http.get("/banks").success(function(data){
                $scope.menuBarData = data;
                $scope.menuBarData.selectedBank = $cookies.defaultBank;
                SharedDataService.setData("selectedBank",  $cookies.defaultBank);
            });

            this.UpdateBankName = function(bankName){
                $scope.menuBarData.selectedBank = bankName;

                SharedDataService.setData("selectedBank", bankName);
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