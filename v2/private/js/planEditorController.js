var planEditorController = app.controller("planEditorController", ['$http', '$scope', function($http, $scope){  
   
    $(".alert").hide()

    $scope.$on('planIdSet', function(planId,ar2) {
        $scope.PlanId = ar2;
        $scope.GetPlan();
    });

    function GetPlans(){
        $http.get("/Plan")
            .success(function(data){
                $scope.Plans = data;
                //GetAutoPopulateText(data.AutoPopulate)
            });
    }

    $scope.ChangeAutoPopulate = function(){
        $scope.Plan.AutoPopulate = !$scope.Plan.AutoPopulate;
    }

    $scope.GetAutoPopulateText= function(){
       /* if($scope.Plan.AutoPopulate)
            return "Disable Auto Populate";
        return "Enable Auto Populate";*/
        if($scope.Plan && $scope.Plan.AutoPopulate)
            return "Auto Fill On";
        return "Auto Fill Off";
    }
    
    $scope.GetPlan = function(){
        $http.get("/Plan/"+$scope.PlanId)
            .success(function(data){
                for(var i = 0; i < data.PlannedTransactions.length; i++){
                   
                    data.PlannedTransactions[i].StartDate = new Date(data.PlannedTransactions[i].StartDate).toLocaleDateString();
                }
                $scope.Plan = data;
            });
    };
    
    $scope.AddRow = function(){
        var planRow = {StartDate: new Date().toLocaleDateString()}
        $scope.Plan.PlannedTransactions.push(planRow);
    }
    $scope.AddPlan = function(){
        var value = prompt("Enter name of new plan");
        var settings = {
            url: '/Plan',
            method: "PUT",
            headers: {
                'content-type': 'application/json',
                'accept': 'application/json'
            },
            data: angular.toJson({
                'Name': value
            })
        };
        
        $http(settings)
            .success(function(data){
                GetPlans();
            });            
    };

     $scope.SavePlan = function(){
        var settings = {
            url: '/Plan/'+ $scope.PlanId,
            method: "POST",
            headers: {
                'content-type': 'application/json',
                'accept': 'application/json'
            },
            data: angular.toJson($scope.Plan)
        };
        
        $http(settings)
            .success(function(data){
                GetPlans();
                $(".alert-success").show();
                window.setTimeout(function(){
                    $(".alert-success").hide();
                }, 10000);
            });            
    };
        
        GetPlans();
}]);