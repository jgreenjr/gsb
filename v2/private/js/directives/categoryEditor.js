app.directive('categoryEditor', function () {
    return {
        restrict: 'E',
        templateUrl: 'directives/category-editor.html',
        controller: function ($scope, $http, DataShareService) {
            $scope.ShowEditor = function () {
                $http.get('/Category/' + DataShareService.selectedBankId)
                    .success(function (data) {
                        $scope.Categories = data;
                      //  $("#CategoryEditor").modal("show");
                    });
            }
            $scope.SaveCategories = function(){
                $http.post('/Category/' + DataShareService.selectedBankId, $scope.Categories, {headers: {
                    'content-type': 'application/json',
                    'accept': 'application/json'
                }}).success(function (arg1, arg2) {
                    DataShareService.updateCategoryData( $scope.Categories);
                     $('#CategoryEditor').modal('hide');
                }).error(function (arg1, arg2) {
                        alert('failed') });
            }

            $scope.$on('selectedBankUpdated', function(){
                $scope.ShowEditor();
            });
        }

    }
}
);