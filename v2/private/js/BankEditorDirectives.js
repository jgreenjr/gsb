/**
 * Created by greenj on 9/6/15.
 */
app.directive('bankEditor', function () {
    return {
        templateUrl: 'directives/bank-editor.html',
        controller: function ($scope, $http) {
            $scope.addUser = function () {
                if (!$scope.targetBank.Users) {
                    $scope.targetBank.Users = [];
                }
                $scope.targetBank.Users.push($('#NewUserName').val());
            }

            $scope.removeUser = function (user) {
                var index = $scope.targetBank.Users.indexOf(user);
                $scope.targetBank.Users.splice(index, 1);
            }

            $scope.SaveBank = function () {
                $http.put('/Bank', $scope.targetBank).success(function (data) {
                    $('#bankEditor').modal('hide');
                }).error(function (err) {
                    alert(err);
                });
            }
        },
        controllerAs: 'bankEditorCtrl'
    }
})
