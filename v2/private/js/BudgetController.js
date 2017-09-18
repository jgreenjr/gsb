app.controller("BudgetController", ['$http', '$scope', function ( $http, $scope) {
    $scope.newBudget = {Type:"Income"};
    $http.get("/Budget")
        .success(function(data){
           $scope.Budgets = data;
        })
        .error(function(data){
            alert("There was an error");
        });
    $scope.GetBudget = function(){
        $http.get("/Budget/" + $scope.SelectedBudgetId)
            .success(function(data){
                $scope.SelectedBudget = data
            })
            .error(function(data){
                alert(data)
            });
    }
    $scope.GetRemaining = function(Budget){
        return 0;
    }
    $scope.launchBudgetAdd = function(){
        $("#budgetModal").modal();
    }

    $scope.saveForm = function(){
        $http.put("/Budget/"+$scope.SelectedBudgetId,$scope.newBudget)
            .success(function(){
                $scope.GetBudget();
                $("#budgetModal").modal("hide");
            });

       
    }
    $scope.updateBudget=function(budget){
        $http.post("/Budget/"+$scope.SelectedBudgetId+"/"+ budget._id, budget)
             .success(function(){
                $scope.GetBudget();
            });
    }

    $scope.deleteBudget=function(budget){
       
        $http.delete("/Budget/"+$scope.SelectedBudgetId+"/"+ budget._id)
             .success(function(){
                $scope.GetBudget();
            });
    }
}]);