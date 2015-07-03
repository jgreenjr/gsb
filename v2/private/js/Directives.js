/**
 * Created by greenj on 6/27/15.
 */
app.directive("menuBar", ["$http", function($http){
    return {
        restrict:"E",

        "templateUrl":"directives/menu-bar.html",
        controller: function($scope){
            $scope.menuBarData = {username: "asdf", banks: []};
            $http.get("/banks").success(function(data){
                $scope.menuBarData = data;
                console.log(data);
                $scope.menuBarData.selectedBank = "test123";
            });
        },
        controllerAs: "menuCtrl",
       // template: "<div>{{data.username}}</div>"
    };
}]);