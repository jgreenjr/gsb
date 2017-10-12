app.directive('transactionDelete', function() {
    return {
        restrict: 'E',
       
        controller: function ($scope, $http, DataShareService){
            $scope.DeleteTrans = function(){
                $http.delete('/Transaction/' + $scope.selectedBankId + '/' + $scope.transaction.id, { headers: { 'accept': 'application/json' }, responseType: 'json' }).success(function (data) {
                    $scope.$broadcast('TransactionUpdated');
                    $("#delete-alert").modal("hide");
                });
            }

            $scope.$on("TransactionDelete", function(arg, arg1, arg2){
                console.log(arg1);
                $scope.selectedBankId = arg1;
                $scope.transaction = arg2;
                $("#delete-alert").modal();
            });
        },
        templateUrl: 'directives/transaction-delete.html'
    };
});
