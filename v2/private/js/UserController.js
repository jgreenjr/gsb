'use strict';
var gsb = angular.module('gsbApp', ['ngCookies']);
gsb.controller('UserController', ['$http', '$cookies', '$scope', function ($http, $cookies, $scope) {
    var self = this;
    this.Pin = '';
    this.password = '';
     $http.get('/User') .success(function(data){
                $scope.User=data;
    $http.get('/Bank')
        .success(function (data) {
            $scope.Banks = data;
            
             })
    });
   

   // this.defaultBank = $cookies.defaultBank;

    this.Save = function () {
       // var data = JSON.stringify({'username': this.username, 'defaultBank': this.defaultBank, 'Pin': this.Pin, 'password': this.password});

        $http.post('/User/'+$scope.User.id, $scope.User, {'headers': {'content-type': 'text/json',
            'accept': 'text/plain'}}).success(function (arg1, arg2) {
                alert('updated') }).error(function (arg1, arg2) {
                    alert('failed') });
    };
}]);
