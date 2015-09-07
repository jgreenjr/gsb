/**
 * Created by greenj on 9/6/15.
 */

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

app.controller("bankConfigurationController", ["$scope", "$http", function($scope, $http){
    $http.get("/BankConfiguration").success(function(data){
        $scope.metaData = data;
    }).error(function(arg1, arg2){
        $scope.metaData = args1;
    })

    $scope.editBank = function(bank){
        $scope.targetBank = bank;
        $("#bankEditor").modal();
    }

    $scope.addUser = function(){
        $scope.targetBank.users.push( $("#NewUserName").val());
    }

    $scope.removeUser = function(user){
        var index = $scope.targetBank.users.indexOf(user);
        $scope.targetBank.users.splice(index,1);
    }

    $scope.SaveBank = function(){
        $http.post("/BankConfiguration", $scope.targetBank).success(function(data){
            $("#bankEditor").modal("hide");
        });
    }
}]);